#!/usr/bin/env python3
"""MIME-correct static file server for local verification of Framer-section embeds.

Python's stdlib http.server serves .mjs as the wrong content-type, so the Framer
runtime never boots. This serves .mjs/.js as text/javascript (Vercel does this in
production). Usage:  python3 tools/serve.py <port> <dir>
"""
import http.server, socketserver, sys
PORT=int(sys.argv[1]); DIR=sys.argv[2]
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*a,**k): super().__init__(*a,directory=DIR,**k)
H.extensions_map={**http.server.SimpleHTTPRequestHandler.extensions_map,
  '.mjs':'text/javascript','.js':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2'}
socketserver.TCPServer.allow_reuse_address=True
with socketserver.TCPServer(("",PORT),H) as httpd: httpd.serve_forever()
