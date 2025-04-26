# 🧠 MultiAgent Githubify

An AI-powered assistant that lets you ask questions about your codebase and get smart, summarized answers using LLMs (Large Language Models)!

Supports both **Terminal Client** and **Streamlit Web UI** 🚀

---

## 📂 Project Structure

```plaintext
├── agents/
│   ├── retriever_agent.py   # Retrieves relevant code snippets
│   └── reasoner_agent.py    # Summarizes snippets using LLM
├── client/
│   └── chat_client.py       # Terminal-based chat client
├── server/
│   └── main.py              # FastAPI WebSocket server (MCP)
├── utils/
│   ├── builder.py           # Builds vectorstore (FAISS index)
│   └── embedder.py          # Embedding code using transformer model
├── vectorstore/             # FAISS index and documents
│   ├── faiss_index.bin
│   └── docs.pkl
├── streamlit_chat_client.py # Streamlit-based frontend UI
├── .env                     # Environment variables (API keys)
└── README.md                # (this file)
```

---

## 🚀 How to Setup & Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/Aniket-Suthar/multiagent_githubify.git
cd multiagent_githubify
```

---

### 2. Install Python Requirements
Make sure you are using **Python 3.10+** (recommended 3.11).

```bash
pip install -r requirements.txt
```

If `requirements.txt` doesn't exist yet, install manually:

```bash
pip install streamlit fastapi uvicorn websockets faiss-cpu numpy sentence-transformers python-dotenv tqdm groq
```

---

### 3. Set Your Environment Variables

Create a **`.env`** file in the root folder:

```bash
touch .env
```

Inside `.env`, add:

```dotenv
GROQ_API_KEY=your_groq_api_key_here
```

> ⚡ **Important**: You must have a valid [Groq API Key](https://console.groq.com/keys) to access the LLM.

---

### 4. Build the FAISS Vectorstore
(Indexes your codebase into embeddings)

```bash
python -c "from utils.builder import build_vectorstore; build_vectorstore('path_to_your_codebase_folder', 'vectorstore')"
```

Example:

```bash
python -c "from utils.builder import build_vectorstore; build_vectorstore('BACKEND', 'vectorstore')"
```

This will create:
- `vectorstore/faiss_index.bin`
- `vectorstore/docs.pkl`

---

### 5. Start the FastAPI WebSocket Server
(Acts as the Main Control Plane - MCP)

```bash
uvicorn server.main:app --reload
```

> Server starts at `http://localhost:8000/ws`

---

## 🧠 Start the Agents

In separate terminals, run:

### 6. Retriever Agent
```bash
python agents/retriever_agent.py
```

### 7. Reasoner Agent
```bash
python agents/reasoner_agent.py
```

---

## 🎯 Choose Your Client

You can use either the terminal or the Streamlit web interface.

---

### A. Terminal Client

```bash
python client/chat_client.py
```
- Text-based input and output.
- Simple, fast.

---

### B. Streamlit Web App Client

```bash
streamlit run streamlit_chat_client.py
```

- Modern chat UI (similar to ChatGPT).
- Keeps conversation history.
- Easy to use and interactive.

Access at: [http://localhost:8501](http://localhost:8501)

---

## 📚 How the System Works

| Component            | Description |
|:---------------------|:------------|
| **Builder**           | Embeds your code files and stores them in FAISS vectorstore. |
| **Retriever Agent**   | Retrieves relevant code snippets based on your query. |
| **Reasoner Agent**    | Summarizes the retrieved code using a powerful LLM (Groq API). |
| **FastAPI Server**    | Orchestrates the communication between client and agents. |
| **Clients**           | Interface for users (Terminal or Web Streamlit). |

---

## 🛠 Troubleshooting

- **GROQ_API_KEY not working?**  
  → Ensure you run `load_dotenv()` in your code, and your `.env` file is correct.

- **Vectorstore errors?**  
  → Always run the `build_vectorstore()` step first.

- **WebSocket connection issues?**  
  → Ensure FastAPI server and agents are running before the client.

- **Streamlit stuck or blank?**  
  → Check the console for missing agent errors. Restart agents if necessary.

---

## ✨ Features

- Code-aware question answering
- Summarized and accurate code analysis
- Protects against hallucinated or unsafe answers
- Supports multi-language codebases (`.py`, `.js`, `.html`, `.css`, `.ts`, `.jsx`, `.tsx`, etc.)
- Modular agent-based architecture
- Beautiful Streamlit frontend

---

## 🔥 Upcoming Improvements (optional for future)

- Memory for long conversations
- Better UI using chat bubbles
- User authentication
- Multiple codebase support
- LLM selection (user can choose model)

---

# 📢 Final Commands Quick Reference

```bash
# Build vectorstore (only once or after codebase updates)
python -c "from utils.builder import build_vectorstore; build_vectorstore('BACKEND', 'vectorstore')"

# Start server
uvicorn server.main:app --reload

# Start retriever agent
python agents/retriever_agent.py

# Start reasoner agent
python agents/reasoner_agent.py

# Start Terminal Client (optional)
python client/chat_client.py

# Start Streamlit Web Client (preferred)
streamlit run client/streamlit_chat_client.py
```

---

# ❤️ Made with love for developers who love clean code.

---
