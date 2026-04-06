import os, socketserver, http.server
os.chdir(os.path.dirname(os.path.abspath(__file__)))
PORT = 3000
http.server.SimpleHTTPRequestHandler.extensions_map['.js'] = 'application/javascript'
with socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler) as httpd:
    print(f"http://localhost:{PORT}")
    httpd.serve_forever()
