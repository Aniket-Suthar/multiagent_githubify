# COMMANDS TO RUN

### 1.python -c "from utils.builder import build_vectorstore; build_vectorstore('BACKEND', 'vectorstore')"

### 2.uvicorn server.main:app --reload

## Starting the agents 

### 3.python agents/retriever_agent.py

### 4.python agents/reasoner_agent.py


## Starting the main Client
### 5.python client/chat_client.py

## Starting the Streamlit Client

### 6. streamlit run streamlit_chat_client.py
