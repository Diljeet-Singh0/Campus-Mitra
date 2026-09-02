"""
rag_engine.py
=============
MANNMITRA - Local ChromaDB RAG engine over a ./docs folder of coping /
academic-support resources, with gated (dual-path) retrieval so it only
fires when genuinely relevant instead of on every turn.
"""

from __future__ import annotations

import os
import re
import logging
from dataclasses import dataclass, field
from typing import List, Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mannmitra.rag_engine")

DOCS_DIR = "./docs"
PERSIST_DIR = "./chroma_db"
COLLECTION_NAME = "mannmitra_resources"

# --------------------------------------------------------------------------
# Default seed documents (created only if ./docs is missing/empty)
# --------------------------------------------------------------------------
DEFAULT_DOCS = {
    "breathing_techniques.txt": """# Box Breathing
Box breathing is a simple technique used by athletes and first responders to
calm the nervous system quickly. Breathe in slowly through your nose for a
count of 4. Hold the breath for a count of 4. Exhale slowly through your
mouth for a count of 4. Hold the empty breath for a count of 4. Repeat this
cycle 4-6 times.

# 4-7-8 Breathing
Inhale quietly through the nose for 4 seconds. Hold the breath for 7
seconds. Exhale completely through the mouth, making a whoosh sound, for 8
seconds. This pattern is especially useful before sleep or during a panic
attack because the long exhale activates the parasympathetic nervous
system, which slows the heart rate.

# Diaphragmatic (Belly) Breathing
Place one hand on your chest and one on your belly. Breathe in slowly
through your nose so that your belly rises more than your chest. Exhale
slowly through pursed lips. This reduces the shallow, rapid breathing that
often accompanies chest tightness and panic.
""",
    "grounding_54321.txt": """# The 5-4-3-2-1 Grounding Technique
This exercise uses your five senses to pull your attention back to the
present moment when you feel overwhelmed, panicky, or disconnected.

Name 5 things you can SEE around you right now.
Name 4 things you can physically FEEL (the chair under you, your feet on
the floor, the texture of your sleeve).
Name 3 things you can HEAR right now.
Name 2 things you can SMELL, or two smells you like.
Name 1 thing you can TASTE, or one thing you like about yourself.

# Why Grounding Works
Grounding techniques interrupt the spiral of anxious or racing thoughts by
redirecting attention to concrete sensory input. This can shorten the
intensity and duration of a panic attack and is safe to use anywhere,
including in a classroom or exam hall.
""",
    "academic_paralysis.txt": """# Breaking Academic Paralysis
Academic paralysis happens when a workload feels so large that starting
feels impossible, and avoidance makes the anxiety worse. A few things that
help:

Break the task into a ridiculously small first step, such as "open the
textbook" or "write one sentence," rather than "finish the syllabus."
Use a timer for 10-15 minutes of focused work followed by a short break
(the Pomodoro approach), rather than committing to hours at once.
Separate the backlog into "must do this week" and "can wait," since trying
to catch up on everything at once fuels the sense of being overwhelmed.

# Talking to Professors About Backlogs or Missed Deadlines
Most professors and academic advisors would rather hear from a student
early than have them disappear. A short, honest email explaining the
situation and asking for a revised plan is usually better received than
silence.
""",
    "campus_counseling.txt": """# Accessing Campus Counseling Services
Most Indian colleges and universities have a Student Wellness or
Counseling Cell, often reachable through the Dean of Student Welfare's
office or the college website. Sessions are typically confidential and
free for enrolled students.

# National Support Lines (India)
Tele-MANAS: 14416, a 24/7 free national tele-mental-health helpline run
by the Ministry of Health and Family Welfare, offering counseling in
multiple Indian languages.
KIRAN Mental Health Rehabilitation Helpline: 1800-599-0019, a 24/7
toll-free helpline offering support for anxiety, stress, depression, and
crisis situations.

# When to Seek In-Person Help
If distress is persistent over multiple weeks, is interfering with sleep,
appetite, or academics, or involves thoughts of self-harm, it is worth
speaking to a counselor or trusted mentor in person rather than managing
it alone.
""",
}

# --------------------------------------------------------------------------
# Gated retrieval trigger keywords
# --------------------------------------------------------------------------
ACADEMIC_KEYWORDS = [
    "exam", "syllabus", "backlog", "assignment", "deadline", "semester",
    "grades", "revising", "focus", "revision", "study", "learn", "marks",
    "test", "college", "professor", "gpa", "coursework", "paralysis"
]
PANIC_KEYWORDS = [
    "panic attack", "can't breathe", "cant breathe", "chest tight",
    "chest tightness", "panic", "anxiety", "anxious", "overwhelmed",
    "stressed", "stress", "scared", "fear", "worried", "nervous"
]
SLEEP_KEYWORDS = [
    "can't sleep", "cant sleep", "insomnia", "haven't slept", "havent slept",
    "sleep", "exhausted", "drained", "tired", "need to relax", "restless", "nightmare"
]
TECHNIQUE_KEYWORDS = [
    "grounding", "breathing", "help me relax", "calm down", "breathe",
    "exercise", "help", "technique", "tip", "coping", "guidance",
    "counselor", "counseling", "support", "helpline", "tele-manas", "kiran"
]
SOMATIC_MARKERS = [
    "chest", "breath", "sleep", "shaking", "heart racing", "dizzy",
    "nausea", "panic", "help", "headache", "stomach", "tired", "exhausted"
]

_ALL_EXPLICIT_KEYWORDS = (
    ACADEMIC_KEYWORDS + PANIC_KEYWORDS + SLEEP_KEYWORDS + TECHNIQUE_KEYWORDS
)


@dataclass
class RAGContext:
    is_used: bool
    retrieved_documents: List[str] = field(default_factory=list)
    sources: List[str] = field(default_factory=list)


def _ensure_docs_dir(docs_dir: str = DOCS_DIR) -> None:
    if not os.path.isdir(docs_dir):
        os.makedirs(docs_dir, exist_ok=True)

    existing_txt = [f for f in os.listdir(docs_dir) if f.endswith(".txt")]
    if existing_txt:
        return

    logger.info("No .txt resources found in %s; seeding default documents.", docs_dir)
    for filename, content in DEFAULT_DOCS.items():
        path = os.path.join(docs_dir, filename)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content.strip() + "\n")


def _chunk_text(text: str) -> List[str]:
    """Split text into chunks by markdown-style headers, falling back to
    paragraph splitting."""
    header_split = re.split(r"\n(?=#\s)", text.strip())
    chunks: List[str] = []
    for block in header_split:
        block = block.strip()
        if not block:
            continue
        if len(block) > 900:
            # further split long header blocks by paragraph
            for para in re.split(r"\n\s*\n", block):
                para = para.strip()
                if para:
                    chunks.append(para)
        else:
            chunks.append(block)
    return chunks if chunks else [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]


class RAGEngine:
    def __init__(self, docs_dir: str = DOCS_DIR, persist_dir: str = PERSIST_DIR) -> None:
        self.docs_dir = docs_dir
        self.persist_dir = persist_dir
        self._raw_chunks: List[dict] = []  # fallback corpus list of {chunk, source}

        _ensure_docs_dir(self.docs_dir)
        self._load_raw_chunks()

        self._chroma_ready = False
        try:
            import chromadb
            from chromadb.utils import embedding_functions

            self._client = chromadb.PersistentClient(path=self.persist_dir)

            try:
                self._embed_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
                    model_name="sentence-transformers/all-MiniLM-L6-v2"
                )
            except Exception as exc:  # noqa: BLE001
                logger.warning("SentenceTransformer embedding function failed (%s); using default.", exc)
                self._embed_fn = embedding_functions.DefaultEmbeddingFunction()

            self._collection = self._client.get_or_create_collection(
                name=COLLECTION_NAME,
                embedding_function=self._embed_fn,
            )

            # Count source docs to detect new files added since last index
            doc_files = [f for f in os.listdir(self.docs_dir) if f.endswith(".txt")] if os.path.isdir(self.docs_dir) else []
            existing_count = self._collection.count()

            if existing_count == 0 or len(doc_files) != len(set(
                m.get("source", "") for m in (self._collection.get(include=["metadatas"]).get("metadatas") or [])
            )):
                # New docs detected or empty collection — full re-index
                if existing_count > 0:
                    logger.info("Detected new docs in %s. Clearing and re-indexing...", self.docs_dir)
                    self._client.delete_collection(COLLECTION_NAME)
                    self._collection = self._client.get_or_create_collection(
                        name=COLLECTION_NAME,
                        embedding_function=self._embed_fn,
                    )
                self._index_documents()
            else:
                logger.info(
                    "Collection '%s' already has %d documents; skipping re-index.",
                    COLLECTION_NAME,
                    existing_count,
                )
            self._chroma_ready = True
        except Exception as exc:  # noqa: BLE001
            logger.warning("ChromaDB initialization failed (%s). Fallback keyword search enabled.", exc)
            self._chroma_ready = False

    def _load_raw_chunks(self) -> None:
        """Load text files in memory for fast fallback keyword matching."""
        self._raw_chunks = []
        if not os.path.exists(self.docs_dir):
            return

        for filename in sorted(os.listdir(self.docs_dir)):
            if not filename.endswith(".txt"):
                continue
            path = os.path.join(self.docs_dir, filename)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    text = f.read()
                chunks = _chunk_text(text)
                for chunk in chunks:
                    self._raw_chunks.append({"chunk": chunk, "source": filename})
            except Exception as e:
                logger.warning("Failed to read %s: %s", path, e)

    # ------------------------------------------------------------------
    def _index_documents(self) -> None:
        ids: List[str] = []
        docs: List[str] = []
        metadatas: List[dict] = []

        for filename in sorted(os.listdir(self.docs_dir)):
            if not filename.endswith(".txt"):
                continue
            path = os.path.join(self.docs_dir, filename)
            with open(path, "r", encoding="utf-8") as f:
                text = f.read()

            chunks = _chunk_text(text)
            for i, chunk in enumerate(chunks):
                ids.append(f"{filename}::chunk{i}")
                docs.append(chunk)
                metadatas.append({"source": filename})

        if not docs:
            logger.warning("No documents found to index in %s.", self.docs_dir)
            return

        self._collection.add(ids=ids, documents=docs, metadatas=metadatas)
        logger.info("Indexed %d chunks from %s into ChromaDB.", len(docs), self.docs_dir)

    # ------------------------------------------------------------------
    def should_retrieve(self, text: str, distress_score: float = 0.0) -> bool:
        lowered = (text or "").lower()

        # Path 1: explicit query / keyword trigger
        for kw in _ALL_EXPLICIT_KEYWORDS:
            if kw in lowered:
                return True

        # Path 2: autonomous distress trigger (score >= 0.35 OR somatic markers)
        if distress_score >= 0.35:
            return True

        for marker in SOMATIC_MARKERS:
            if marker in lowered:
                return True

        return False

    # ------------------------------------------------------------------
    def _fallback_keyword_retrieve(self, text: str, n_results: int = 2) -> RAGContext:
        """Lightweight token overlap retrieval if vector search fails/is unavailable."""
        if not self._raw_chunks:
            return RAGContext(is_used=False, retrieved_documents=[], sources=[])

        tokens = set(re.findall(r"\w+", text.lower()))
        scored: List[Tuple[float, str, str]] = []

        for item in self._raw_chunks:
            chunk = item["chunk"]
            source = item["source"]
            chunk_tokens = set(re.findall(r"\w+", chunk.lower()))
            overlap = len(tokens.intersection(chunk_tokens))
            if overlap > 0:
                scored.append((overlap, chunk, source))

        if not scored:
            # Pick first 2 default documents as fallback
            default_items = self._raw_chunks[:n_results]
            return RAGContext(
                is_used=True,
                retrieved_documents=[it["chunk"] for it in default_items],
                sources=[it["source"] for it in default_items]
            )

        scored.sort(key=lambda x: x[0], reverse=True)
        top_items = scored[:n_results]
        return RAGContext(
            is_used=True,
            retrieved_documents=[it[1] for it in top_items],
            sources=[it[2] for it in top_items]
        )

    # ------------------------------------------------------------------
    def retrieve(self, text: str, distress_score: float = 0.0, n_results: int = 2) -> RAGContext:
        if not self.should_retrieve(text, distress_score):
            return RAGContext(is_used=False, retrieved_documents=[], sources=[])

        if self._chroma_ready:
            try:
                results = self._collection.query(query_texts=[text], n_results=n_results)
                documents = results.get("documents", [[]])[0]
                metadatas = results.get("metadatas", [[]])[0]
                sources = [m.get("source", "unknown") for m in metadatas]

                if documents and len(documents) > 0:
                    return RAGContext(is_used=True, retrieved_documents=documents, sources=sources)
            except Exception as exc:  # noqa: BLE001
                logger.error("ChromaDB query failed: %s. Using keyword fallback.", exc)

        return self._fallback_keyword_retrieve(text, n_results=n_results)


# --------------------------------------------------------------------------
# Manual smoke test
# --------------------------------------------------------------------------
if __name__ == "__main__":
    engine = RAGEngine()
    tests = [
        ("tired after classes", 0.2),
        ("I have a panic attack every time I think about my exam backlog", 0.6),
        ("can you teach me a grounding technique", 0.3),
        ("my chest feels tight and I can't breathe", 0.55),
    ]
    for text, score in tests:
        ctx = engine.retrieve(text, score)
        print(f"used={ctx.is_used} sources={ctx.sources} text={text!r}")