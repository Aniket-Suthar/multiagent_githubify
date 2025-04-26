import os
import pickle
import faiss
import numpy as np
from utils.embedder import embed_text

def load_code_files(directory: str):
    documents = []
    metadata = []

    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith((".py", ".js", ".html")):
                filepath = os.path.join(root, file)
                print(f"📄 Loading file: {filepath}")  # ADD THIS
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()

                    lines = content.split("\n")
                    for i, line in enumerate(lines):
                        if line.strip():
                            documents.append(line.strip())
                            metadata.append({"file": filepath, "line": i+1})

    return documents, metadata

def build_vectorstore(code_dir: str, save_path: str):
    print("🚀 Starting to build vectorstore...")
    
    docs, meta = load_code_files(code_dir)
    print(f"✅ Loaded {len(docs)} code snippets.")

    vectors = [embed_text(doc) for doc in docs]
    print("🔍 Code embedded into vectors.")

    dimension = vectors[0].shape[0]
    index = faiss.IndexFlatL2(dimension)
    index.add(np.array(vectors))

    faiss.write_index(index, os.path.join(save_path, "faiss_index.bin"))
    with open(os.path.join(save_path, "docs.pkl"), "wb") as f:
        pickle.dump((docs, meta), f)

    print("🎯 Vectorstore successfully built and saved to disk.")
