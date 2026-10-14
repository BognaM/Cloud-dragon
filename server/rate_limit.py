"""Limits how many messages reach the model, so strangers can't use up the GPU.

Two limits: per visitor (a few messages a minute, more per hour) and for
everyone together per day, which caps the cost even if many people use the link.
The page answers crisis messages itself, so they never count or get blocked.

The app runs in one container (max_containers=1 in app.py), so counting in
memory is enough. Visitors' addresses are kept only in memory, for at most an
hour, and never logged. All counts reset when the container shuts down.
"""

import math
import time
from collections import deque

MINUTE = 60
HOUR = 60 * MINUTE
DAY = 24 * HOUR


class RateLimiter:
    def __init__(self, per_minute, per_hour, per_day, clock=time.monotonic):
        self.per_minute = per_minute
        self.per_hour = per_hour
        self.per_day = per_day
        self.clock = clock
        self.visitors = {}  # address -> times of their messages in the last hour
        self.everyone = deque()  # times of everyone's messages in the last day

    def retry_after(self, address):
        """0 if this message may go through (it's counted), otherwise seconds to wait."""
        now = self.clock()
        self._forget_old(now)
        times = self.visitors.setdefault(address, deque())

        waits = []
        last_minute = [t for t in times if now - t < MINUTE]
        if len(last_minute) >= self.per_minute:
            waits.append(MINUTE - (now - last_minute[0]))
        if len(times) >= self.per_hour:
            waits.append(HOUR - (now - times[0]))
        if len(self.everyone) >= self.per_day:
            waits.append(DAY - (now - self.everyone[0]))
        if waits:
            return max(1, math.ceil(max(waits)))

        times.append(now)
        self.everyone.append(now)
        return 0

    def _forget_old(self, now):
        while self.everyone and now - self.everyone[0] >= DAY:
            self.everyone.popleft()
        for address in list(self.visitors):
            times = self.visitors[address]
            while times and now - times[0] >= HOUR:
                times.popleft()
            if not times:
                del self.visitors[address]
