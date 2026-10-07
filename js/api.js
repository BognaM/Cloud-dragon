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

// Sends the chat and calls onText with the reply so far each time more of it
// streams in. Resolves with the full reply.
export async function streamChat(payload, { onText }) {
  const response = await fetch(endpoint("/chat"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

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
