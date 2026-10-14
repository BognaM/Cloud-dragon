"""Runs the model and yields the reply in small pieces while it's still generating."""

import threading

import torch
from transformers import StoppingCriteria, StoppingCriteriaList, TextIteratorStreamer

from .config import MAX_NEW_TOKENS, TEMPERATURE, TOP_P
from .logs import log


class StopWhenAsked(StoppingCriteria):
    """Ends generation early once `stop` is set, e.g. when the person presses Stop."""

    def __init__(self, stop):
        self.stop = stop

    def __call__(self, input_ids, scores, **kwargs):
        return self.stop.is_set()


def stream_reply(tokenizer, model, messages, request_id, stop):
    """`stop`: a threading.Event; setting it ends generation within a token or so."""
    # Each model expects its own role separators; the chat template adds them
    # and the assistant start marker. enable_thinking=False is for Qwen3.
    prompt = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True,
        enable_thinking=False,
    )
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    log("chat.generating", request_id=request_id, input_tokens=inputs.input_ids.shape[1], max_new_tokens=MAX_NEW_TOKENS)

    # The streamer hands decoded text over as soon as tokens are generated.
    streamer = TextIteratorStreamer(tokenizer, skip_prompt=True, skip_special_tokens=True)

    def generate():
        try:
            # No gradients needed: we generate text rather than train weights.
            with torch.inference_mode():
                output = model.generate(
                    **inputs,
                    streamer=streamer,
                    max_new_tokens=MAX_NEW_TOKENS,
                    temperature=TEMPERATURE,
                    top_p=TOP_P,
                    do_sample=True,
                    pad_token_id=tokenizer.eos_token_id,
                    stopping_criteria=StoppingCriteriaList([StopWhenAsked(stop)]),
                )
            new_tokens = output.shape[1] - inputs.input_ids.shape[1]
            log("chat.generated", request_id=request_id, new_tokens=new_tokens, stopped_early=stop.is_set())
        except Exception as error:
            log("chat.failed", request_id=request_id, error_type=type(error).__name__)
            streamer.end()  # Unblock the reader so the response can finish.

    # Generation runs in the background while the response streams the text.
    threading.Thread(target=generate, daemon=True).start()

    for piece in streamer:
        if piece:
            yield piece
