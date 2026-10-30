
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import fitz
import uuid

app = FastAPI(title="StudyMate AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

documents = {}


class QuestionRequest(BaseModel):
    document_id: str
    question: str


@app.get("/")
def home():
    return {"message": "StudyMate AI backend is running"}


@app.post("/api/documents/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload a PDF file.")

    content = await file.read()

    try:
        with fitz.open(stream=content, filetype="pdf") as pdf:
            pages = [
                {"page": i + 1, "text": page.get_text()}
                for i, page in enumerate(pdf)
            ]
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read this PDF.")

    if not any(p["text"].strip() for p in pages):
        raise HTTPException(
            status_code=400,
            detail="No selectable text found. This PDF may be scanned."
        )

    document_id = str(uuid.uuid4())
    documents[document_id] = {
        "title": file.filename,
        "pages": pages,
    }

    return {
        "document_id": document_id,
        "title": file.filename,
        "page_count": len(pages),
        "message": "PDF text extracted successfully."
    }


@app.post("/api/chat/query")
def answer_question(request: QuestionRequest):
    document = documents.get(request.document_id)

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found. Please upload the PDF again."
        )

    words = [
        word.lower().strip(".,?!:;()[]{}")
        for word in request.question.split()
    ]
    keywords = {word for word in words if len(word) > 2}

    matches = []
    for page in document["pages"]:
        text = page["text"]
        sentences = [
            sentence.strip()
            for sentence in text.replace("\n", " ").split(".")
            if sentence.strip()
        ]
        for sentence in sentences:
            score = sum(
                1 for word in keywords
                if word in sentence.lower()
            )
            if score:
                matches.append((score, page["page"], sentence))

    matches.sort(key=lambda item: item[0], reverse=True)
    best = matches[:5]

    if not best:
        return {
            "answer": "I could not find relevant information in this PDF.",
            "sources": [],
        }

    answer = "\n".join(
        f"- {sentence}" for _, _, sentence in best
    )
    sources = [
        {
            "document_title": document["title"],
            "page_number": page,
            "excerpt": sentence,
        }
        for _, page, sentence in best
    ]

    return {"answer": answer, "sources": sources}
