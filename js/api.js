// Talking to the backend on Modal.

import { API_BASE } from "./config.js";

function endpoint(path) {
  return `${API_BASE.replace(/\/$/, "")}${path}`;
}

// Reads Server-Sent Events: `data: {"text": "..."}` blocks, then `data: [DONE]`.
async function readEvents(body, onData) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) return;
    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop(); // Keep any incomplete event for the next read.

    for (const event of events) {
      if (!event.startsWith("data: ")) continue;
      const data = event.slice("data: ".length);
      if (data !== "[DONE]") onData(JSON.parse(data));
    }
  }
}

// Tells the server to stop generating a reply (the Stop button). Fire and forget:
// the page has already stopped reading it.
export function stopOnServer(replyId) {
  fetch(endpoint("/stop"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reply_id: replyId }),
    keepalive: true,
  }).catch(() => {});
}

// Thrown when the server's message limit is reached (server/rate_limit.py).
export class TooManyMessages extends Error {
  constructor(retryAfter) {
    super("Too many messages");
    this.retryAfter = retryAfter; // seconds
  }
}

// Sends the chat and calls onText with the reply so far each time more of it
// streams in. Resolves with the full reply.
export async function streamChat(payload, { onText, signal }) {
  const response = await fetch(endpoint("/chat"), {
    signal, // aborting it is the Stop button
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (response.status === 429) {
    const { detail } = await response.json().catch(() => ({}));
    throw new TooManyMessages(detail?.retry_after ?? 60);
  }
  if (!response.ok || !response.body) {
    throw new Error(`Chat request failed (${response.status})`);
  }

  let answer = "";
  await readEvents(response.body, ({ text }) => {
    answer += text;
    onText(answer);
  });
  return answer.trim();
}
