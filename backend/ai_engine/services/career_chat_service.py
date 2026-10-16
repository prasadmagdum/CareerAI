import os

from ollama import chat


OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")

SYSTEM_PROMPT = """
You are CareerAI, a friendly and practical career assistant.
Help with resumes, job searches, skill development, interview preparation,
and professional growth. Keep replies concise (under 120 words), clear,
supportive, and actionable.
Do not claim to know a user's resume, profile, or application data unless
they have shared it in this conversation. Never encourage users to invent
qualifications or experience. If a request is unrelated to careers, briefly
explain your focus and guide the user back to career topics.
""".strip()


def generate_career_chat_reply(messages):
    response = chat(
        model=OLLAMA_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            *messages,
        ],
        options={
            "temperature": 0.5,
            "num_predict": 256,
        },
    )

    reply = response["message"]["content"].strip()
    if not reply:
        raise ValueError("The career assistant returned an empty reply.")

    return reply
