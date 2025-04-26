import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import asyncio
import websockets
import json
import pickle
import faiss
import numpy as np
from utils.embedder import embed_text

index = faiss.read_index("vectorstore/faiss_index.bin")
with open("vectorstore/docs.pkl", "rb") as f:
    docs, metadata = pickle.load(f)

async def retriever_agent():
    uri = "ws://localhost:8000/ws/retriever_agent"
    async with websockets.connect(uri) as websocket:
        print("✅ Retriever Agent connected.")

        while True:
            try:
                data = await websocket.recv()
                message = json.loads(data)
                print("[Retriever] Received:", message)

                # ✅ Check if payload has query
                if "query" in message.get("payload", {}):
                    query = message["payload"]["query"]
                    query_vec = embed_text(query).reshape(1, -1)

                    D, I = index.search(np.array(query_vec), k=8)
                    retrieved_snippets = [docs[i] for i in I[0]]

                    response = {
                        "task_id": message["task_id"],
                        "sender": "retriever_agent",
                        "receiver": "reasoner_agent",
                        "payload": {"retrieved_code": retrieved_snippets}
                    }
                    await websocket.send(json.dumps(response))
                    print("📬 Sent retrieved snippets to Reasoner Agent.")
                else:
                    print("⚠️ Skipped message: No query found.")

            except Exception as e:
                print(f"❌ Error in retriever agent: {e}")

asyncio.run(retriever_agent())
