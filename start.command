#!/bin/bash
# Double-click launcher (macOS). Serves this folder on a local web server and
# opens Cloud Dragon in the default browser. Keep the Terminal window open
# while you use the app; close it (or press Ctrl+C) to stop the server.
#
# Why not just open index.html? The page loads its scripts as JavaScript
# modules, and browsers only allow those on pages served over http://.

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR" || exit 1

serves_this_app() {
  curl -s --max-time 1 "http://localhost:$1/js/config.js" | grep -q "cloudDragon"
}

# Something already answers on this port (another app or server).
port_in_use() {
  python3 -c "import socket, sys; socket.create_connection(('localhost', int(sys.argv[1])), timeout=0.5)" "$1" 2>/dev/null
}

# Reuse a server already running this app, or take the first free port from 8000 up.
PORT=8000
while port_in_use $PORT; do
  if serves_this_app $PORT; then
    echo "Cloud Dragon is already running at http://localhost:$PORT"
    open "http://localhost:$PORT"
    exit 0
  fi
  PORT=$((PORT + 1))
done

echo "Starting Cloud Dragon at http://localhost:$PORT"
echo "Keep this window open while you use it. Close it or press Ctrl+C to stop."
(sleep 1 && open "http://localhost:$PORT") &
python3 serve.py "$PORT"
