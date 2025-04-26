import asyncio
import websockets
import json
from tqdm import tqdm

async def chat_client():
    uri = "ws://localhost:8000/ws/client"

    while True:
        try:
            async with websockets.connect(uri) as websocket:
                print("✅ Connected to MCP server as Chat Client.")

                while True:
                    query = input("🧑‍💻 Ask about your codebase: ")

                    try:
                        # Send query
                        message = {
                            "task_id": "task_" + str(id(query)),
                            "sender": "client",
                            "receiver": "retriever_agent",
                            "payload": {"query": query}
                        }
                        await websocket.send(json.dumps(message))

                        # Spinner while waiting
                        with tqdm(total=1, desc="⏳ Thinking...", ncols=100) as pbar:
                            while True:
                                answer = await websocket.recv()
                                response = json.loads(answer)

                                if response.get("sender") == "reasoner_agent":
                                    print("\n🧠 Answer:\n", response["payload"]["answer"], "\n")
                                    break

                                pbar.update(0)

                    except websockets.ConnectionClosed:
                        print("⚠️ Connection lost during send/recv.")
                        raise  # Raise to reconnect outer loop

        except (websockets.ConnectionClosedError, ConnectionRefusedError) as e:
            print(f"❌ Server disconnected or unreachable ({e}), retrying in 3 seconds...")
            await asyncio.sleep(3)

asyncio.run(chat_client())
