"""Checks server/rate_limit.py with a fake clock. Run from the project folder:
    python3 -m unittest tests/test_rate_limit.py
"""

import unittest

from server.rate_limit import DAY, HOUR, MINUTE, RateLimiter


class FakeClock:
    def __init__(self):
        self.now = 0.0

    def __call__(self):
        return self.now


class RateLimitTest(unittest.TestCase):
    def setUp(self):
        self.clock = FakeClock()
        self.limiter = RateLimiter(per_minute=3, per_hour=5, per_day=8, clock=self.clock)

    def send(self, address, times=1):
        return [self.limiter.retry_after(address) for _ in range(times)]

    def test_allows_a_few_messages_a_minute(self):
        self.assertEqual(self.send("a", 3), [0, 0, 0])

    def test_blocks_the_next_and_says_how_long_to_wait(self):
        self.send("a", 3)
        self.clock.now = 20
        self.assertEqual(self.send("a"), [40])  # the first message leaves the minute at 60

    def test_allows_again_after_a_minute(self):
        self.send("a", 3)
        self.clock.now = MINUTE
        self.assertEqual(self.send("a"), [0])

    def test_blocked_messages_dont_count(self):
        self.send("a", 3)
        self.send("a", 10)  # all blocked
        self.clock.now = MINUTE
        self.assertEqual(self.send("a", 2), [0, 0])

    def test_hourly_limit(self):
        self.send("a", 3)
        self.clock.now = MINUTE
        self.send("a", 2)  # 5 this hour
        self.clock.now = 2 * MINUTE
        self.assertEqual(self.send("a"), [HOUR - 2 * MINUTE])

    def test_visitors_are_counted_separately(self):
        self.send("a", 3)
        self.assertEqual(self.send("b", 3), [0, 0, 0])

    def test_daily_limit_for_everyone(self):
        for index, address in enumerate("abcdefgh"):  # 8 visitors, 1 message each
            self.clock.now = index
            self.send(address)
        self.clock.now = 10
        self.assertEqual(self.send("i"), [DAY - 10])

    def test_forgets_visitors_after_an_hour(self):
        self.send("a")
        self.clock.now = HOUR
        self.send("b")
        self.assertNotIn("a", self.limiter.visitors)


if __name__ == "__main__":
    unittest.main()
