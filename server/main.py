from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

connected_clients = {}

@app.websocket("/ws/{agent_name}")
async def websocket_endpoint(websocket: WebSocket, agent_name: str):
    await websocket.accept()
    connected_clients[agent_name] = websocket
    print(f"[MCP Server] {agent_name} connected.")

    try:
        while True:
            data = await websocket.receive_text()
            for name, client in connected_clients.items():
                if name != agent_name:
                    await client.send_text(data)
    except:
        print(f"[MCP Server] {agent_name} disconnected.")
        del connected_clients[agent_name]
