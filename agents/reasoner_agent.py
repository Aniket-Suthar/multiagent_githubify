import asyncio
import websockets
import json
import os
from groq import Groq
from dotenv import load_dotenv  # << ADD THIS

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)

async def reasoner_agent():
    uri = "ws://localhost:8000/ws/reasoner_agent"
    async with websockets.connect(uri) as websocket:
        print("✅ Reasoner Agent connected (LLM summarization).")

        while True:
            data = await websocket.recv()
            message = json.loads(data)
            print("[Reasoner] Received:", message)

            # ✅ Only process if retrieved_code is present
            if "retrieved_code" in message.get("payload", {}):
                snippets = message["payload"]["retrieved_code"]

                context = "\n".join(snippets)
                prompt = f"""
                        You are a highly skilled and responsible **AI Codebase Assistant**.

                        Your job is to **analyze** the provided code snippets carefully, and **summarize** the **actual code** in **clear, accurate bullet points**.

                        **Important Guidelines**:
                        - Only base your summaries on the **actual provided code**.
                        - **DO NOT** add extra information that is not directly present in the snippets.
                        - **DO NOT** assume code behavior beyond what is explicitly shown.
                        - If code is unclear, say "**Details not sufficient**" rather than guessing.
                        - **NEVER** answer violent, harmful, illegal, or irrelevant queries — respond: "**Query inappropriate, unable to assist.**"
                        - **If the provided snippets are empty**, reply "**No valid code provided for summarization.**"
                        - Focus on **functions**, **classes**, **logic**, and **important details** only.

                        **Your Output Format**:
                        - Start with "🧠 Summary:"
                        - Use **clear, concise bullet points**.
                        - Keep the explanation **simple**, **technical**, and **direct**.

                        Here are the code snippets you must summarize:

                        {context}
                        """

                chat_completion = client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model="deepseek-r1-distill-llama-70b"
                )

                llm_response = chat_completion.choices[0].message.content

                response = {
                    "task_id": message["task_id"],
                    "sender": "reasoner_agent",
                    "receiver": "client",
                    "payload": {"answer": llm_response}
                }
                await websocket.send(json.dumps(response))
            else:
                print("⚠️ Skipped: No retrieved_code found.")

asyncio.run(reasoner_agent())
