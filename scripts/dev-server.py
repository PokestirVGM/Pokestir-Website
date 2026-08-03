#!/usr/bin/env python3
"""Static dev server that supports HTTP range requests.

`python3 -m http.server` answers a Range request with 200 and the whole file
instead of 206 and the requested slice. Browsers need range support to seek
inside media, so under the plain server no track on the home page is seekable,
on any of them. That masks real playback bugs and invents fake ones.

Usage, from the repo root:

    python3 scripts/dev-server.py           # serves . on 8931
    python3 scripts/dev-server.py 8080      # different port
"""

import functools
import http.server
import os
import re
import socketserver
import sys

RANGE_RE = re.compile(r"bytes=(\d*)-(\d*)")


class RangeHandler(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        header = self.headers.get("Range")
        if not header:
            return super().send_head()

        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        try:
            f = open(path, "rb")
        except OSError:
            self.send_error(404)
            return None

        size = os.fstat(f.fileno()).st_size
        match = RANGE_RE.match(header)
        if not match:
            f.close()
            return super().send_head()

        start_raw, end_raw = match.group(1), match.group(2)
        if start_raw:
            start = int(start_raw)
            end = int(end_raw) if end_raw else size - 1
        else:
            # "bytes=-N" asks for the final N bytes.
            length = int(end_raw or 0)
            start = max(0, size - length)
            end = size - 1
        end = min(end, size - 1)

        if start > end or start >= size:
            f.close()
            self.send_response(416)
            self.send_header("Content-Range", "bytes */%d" % size)
            self.send_header("Content-Length", "0")
            self.end_headers()
            return None

        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", "bytes %d-%d/%d" % (start, end, size))
        self.send_header("Content-Length", str(end - start + 1))
        self.send_header("Accept-Ranges", "bytes")
        self.end_headers()

        f.seek(start)
        remaining = end - start + 1
        while remaining > 0:
            chunk = f.read(min(64 * 1024, remaining))
            if not chunk:
                break
            try:
                self.wfile.write(chunk)
            except (BrokenPipeError, ConnectionResetError):
                # Media elements routinely abandon a range mid-flight.
                break
            remaining -= len(chunk)
        f.close()
        return None

    def end_headers(self):
        # Advertised on every response so the browser knows it can seek at all,
        # not only on the ones it has already asked to slice.
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8931
    root = os.getcwd()
    handler = functools.partial(RangeHandler, directory=root)
    with Server(("127.0.0.1", port), handler) as httpd:
        print("serving %s at http://127.0.0.1:%d (range requests supported)" % (root, port))
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
