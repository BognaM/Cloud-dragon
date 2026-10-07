"""Serves this folder on http://localhost:PORT (used by start.command).

Like `python3 -m http.server`, but tells the browser to check for newer files
on every load, so changes show up with a normal refresh instead of a stale,
cached copy of the scripts.

Run: python3 serve.py [port]   (default 8000)
"""

import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class AlwaysFreshHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # The browser may keep files, but must ask whether they changed (a quick
        # "304 Not Modified" when they didn't).
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    handler = partial(AlwaysFreshHandler, directory=str(Path(__file__).parent))
    with ThreadingHTTPServer(("127.0.0.1", port), handler) as server:
        print(f"Serving Cloud Dragon at http://localhost:{port}", flush=True)
        server.serve_forever()


if __name__ == "__main__":
    main()
