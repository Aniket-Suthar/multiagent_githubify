import asyncio
import websockets
import json
import streamlit as st

# Define server URI
MCP_SERVER_URI = "ws://localhost:8000/ws/client"

# --- Async WebSocket Communication ---
async def send_query_to_mcp(query):
    async with websockets.connect(MCP_SERVER_URI) as websocket:
        message = {
            "task_id": "task_" + str(id(query)),
            "sender": "client",
            "receiver": "retriever_agent",
            "payload": {"query": query}
        }
        await websocket.send(json.dumps(message))

        while True:
            answer = await websocket.recv()
            response = json.loads(answer)

            if response.get("sender") == "reasoner_agent":
                return response["payload"]["answer"]

# --- Streamlit App ---
st.set_page_config(page_title="🧠 Githubify - Codebase Assistant", page_icon="💬")

st.title("🧠 MutliAgent Githubify")
st.write("Ask questions about your codebase and get smart summaries!")

# Chat history
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

if "user_input" not in st.session_state:
    st.session_state.user_input = ""

# Display previous chat
for sender, message in st.session_state.chat_history:
    if sender == "You":
        st.markdown(f"**🧑‍💻 {sender}:** {message}")
    else:
        st.markdown(f"**🤖 {sender}:** {message}")

# New input at the bottom
query = st.chat_input("🧑‍💻 Type your question here...")

if query:
    with st.spinner('Thinking... 🤔'):
        answer = asyncio.run(send_query_to_mcp(query))
    
    # Update chat history
    st.session_state.chat_history.append(("You", query))
    st.session_state.chat_history.append(("Bot", answer))

    # Rerun to show new messages immediately
    st.rerun()
