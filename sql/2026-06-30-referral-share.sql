-- Tablehopp — "share = +1 on the leaderboard" + first-name handles
-- Run this once in the Supabase SQL editor (project clawmax12@gmail.com, ref sjesxyievpxkcmsunjfp).
-- Safe to re-run: every statement is idempotent / CREATE OR REPLACE.
--
-- What it does:
--   1) Adds waitlist.self_shared — set true the first time someone sends their own link.
--   2) register_share(code): one-time self-credit (anon, SECURITY DEFINER). Can't be farmed —
--      sharing again does nothing (the UPDATE only matches self_shared = false).
--   3) get_leaderboard / get_referral_rank: count = real referrals + 1 (if you've shared).
--      Also switches the displayed handle to the first name derived from the email
--      (e.g. william.svanq@… -> "William") — this was the pending handle change too.

-- 1) one-time "I shared my link" flag
alter table public.waitlist add column if not exists self_shared boolean not null default false;

-- 2) credit a share (idempotent, one-time per code)
create or replace function public.register_share(code text)
returns bigint
language plpgsql volatile security definer set search_path=public as $$
declare new_cnt bigint;
begin
  update public.waitlist set self_shared = true
  where ref_code = code and self_shared = false;
  select referrals into new_cnt from public.get_referral_rank(code);
  return coalesce(new_cnt, 0);
end;
$$;

-- 3) leaderboard (top N): referrals + self-share bonus, first-name handle
create or replace function public.get_leaderboard(top_n int default 10)
returns table(rank bigint, handle text, referrals bigint)
language sql stable security definer set search_path=public as $$
  select row_number() over (order by cnt desc, min_created asc), handle, cnt
  from (
    select w.ref_code,
           coalesce(
             nullif(initcap(substring(split_part(w.email,'@',1) from '^[A-Za-zÀ-ÿ]+')), ''),
             initcap(split_part(w.email,'@',1))
           ) as handle,
           count(r.id) + (case when bool_or(w.self_shared) then 1 else 0 end) as cnt,
           min(w.created_at) as min_created
    from public.waitlist w
    left join public.waitlist r on r.referred_by = w.ref_code
    where w.ref_code is not null
    group by w.ref_code, w.email
    having count(r.id) + (case when bool_or(w.self_shared) then 1 else 0 end) > 0
  ) s
  order by cnt desc, min_created asc
  limit greatest(1, least(top_n, 100));
$$;

-- 3b) a single code's rank/standing (same counting rule)
create or replace function public.get_referral_rank(code text)
returns table(referrals bigint, rank bigint, total_referrers bigint)
language sql stable security definer set search_path=public as $$
  with counts as (
    select w.ref_code,
           count(r.id) + (case when bool_or(w.self_shared) then 1 else 0 end) as cnt,
           min(w.created_at) as min_created
    from public.waitlist w
    left join public.waitlist r on r.referred_by = w.ref_code
    where w.ref_code is not null
    group by w.ref_code),
  ranked as (
    select ref_code, cnt, row_number() over (order by cnt desc, min_created asc) rnk
    from counts where cnt > 0)
  select coalesce((select cnt from counts where ref_code=code),0),
         (select rnk from ranked where ref_code=code),
         (select count(*) from ranked);
$$;

-- 4) let the public site call them (anon; reads are aggregate/masked, the write is one-time)
grant execute on function public.register_share(text)   to anon;
grant execute on function public.get_leaderboard(int)    to anon;
grant execute on function public.get_referral_rank(text) to anon;
