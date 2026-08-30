"""
api.py
======
MANNMITRA - Full REST API for Campus-Mitra Application

Features:
- /health : System & AI status
- /chat : Risk triage, GoEmotions sentiment analysis, Gated RAG retrieval, LLM / fallback generator
- /api/auth/* : User Registration & Authentication
- /api/students/* : Student Profiles & Live Priority Scores
- /api/checkins/* : Daily Wellness Check-ins & Automatic Risk Recalculation
- /api/interventions/* : Counselor Intervention Records
- /api/timeline/* : Student Event History
- /api/faculty-requests/* & /api/faculty-observations/* : Faculty Coordination
- /api/admin/* : Department Analytics & Forecasting

Run:
    python MannMitra/api.py
Listener: http://localhost:5000
"""

from __future__ import annotations

import os
import sys
import json
import logging
import re
from typing import List, Dict, Any, Optional

# Ensure MannMitra directory is on sys.path so imports work
# both locally (python api.py) and via gunicorn from root (gunicorn MannMitra.api:app)
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
if _THIS_DIR not in sys.path:
    sys.path.insert(0, _THIS_DIR)

from flask import Flask, request, jsonify
from flask_cors import CORS

from risk_analysis import RiskAnalyzer
from rag_engine import RAGEngine, RAGContext

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mannmitra.api")

# ---------------------------------------------------------------------------
# Load environment variables (.env parser)
# ---------------------------------------------------------------------------
def _load_env_files():
    candidates = [
        os.path.join(os.path.dirname(__file__), ".env"),
        os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
    ]
    for env_path in candidates:
        if os.path.isfile(env_path):
            try:
                with open(env_path, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            k, v = line.split("=", 1)
                            os.environ[k.strip()] = v.strip().strip("'\"")
                logger.info("Loaded environment variables from %s", env_path)
            except Exception as e:
                logger.warning("Could not read env file %s: %s", env_path, e)

_load_env_files()

# ---------------------------------------------------------------------------
# Data Persistence Layer (JSON DB)
# ---------------------------------------------------------------------------
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
DB_FILE = os.path.join(DATA_DIR, "db.json")

INITIAL_USERS = [
    {
        "id": "usr-student-1",
        "name": "Aarohi Verma",
        "email": "aarohi@campus.edu",
        "password": "student123",
        "role": "student",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        "title": "Student",
        "department": "Computer Science & Engineering",
        "studentId": "CS2023-042"
    },
    {
        "id": "usr-counselor-1",
        "name": "Dr. Ananya Sharma",
        "email": "ananya@campus.edu",
        "password": "counselor123",
        "role": "counselor",
        "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
        "title": "Senior Clinical Psychologist",
        "department": "University Student Health Center"
    },
    {
        "id": "usr-admin-1",
        "name": "Dean Mehta",
        "email": "dean.mehta@campus.edu",
        "password": "admin123",
        "role": "admin",
        "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
        "title": "Dean of Student Welfare",
        "department": "Executive Administration"
    }
]

INITIAL_STUDENTS = [
    {
        "id": "std-1",
        "name": "Aarohi Verma",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        "department": "Computer Science & Engineering",
        "year": "3rd Year (B.Tech)",
        "studentId": "CS2023-042",
        "priorityScore": 8.4,
        "priorityLevel": "urgent",
        "moodTrend": "declining",
        "stressScore": 8,
        "sleepHours": 4.5,
        "academicEngagement": "reduced",
        "attendanceRate": 71,
        "lastActivity": "12 mins ago",
        "counselorAssigned": "Dr. Ananya Sharma",
        "primarySignals": ["Attendance decline (-19%)", "Sleep duration < 5h", "Academic engagement drop", "Negative check-in sentiment"],
        "summaryNote": "Consecutive low mood check-ins over 14 days with marked decline in lab attendance."
    },
    {
        "id": "std-2",
        "name": "Rohan Mehta",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        "department": "Mechanical Engineering",
        "year": "2nd Year (B.Tech)",
        "studentId": "ME2024-118",
        "priorityScore": 6.8,
        "priorityLevel": "moderate",
        "moodTrend": "declining",
        "stressScore": 7,
        "sleepHours": 5.5,
        "academicEngagement": "reduced",
        "attendanceRate": 79,
        "lastActivity": "2 hours ago",
        "counselorAssigned": "Dr. Ananya Sharma",
        "primarySignals": ["Midterm exam stress", "Classroom participation drop", "Moderate sleep deficit"],
        "summaryNote": "Showing signs of elevated academic stress leading up to semester assessments."
    },
    {
        "id": "std-3",
        "name": "Priya Sundaram",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        "department": "Business Management",
        "year": "1st Year (MBA)",
        "studentId": "MBA2025-009",
        "priorityScore": 3.2,
        "priorityLevel": "stable",
        "moodTrend": "improving",
        "stressScore": 4,
        "sleepHours": 7.2,
        "academicEngagement": "high",
        "attendanceRate": 94,
        "lastActivity": "Yesterday",
        "counselorAssigned": "Dr. Rajesh Gupta",
        "primarySignals": ["Consistent check-ins", "High peer engagement", "Healthy sleep routine"],
        "summaryNote": "Well-adjusted with active participation in campus activities."
    },
    {
        "id": "std-4",
        "name": "Kabir Das",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        "department": "Electronics & Communication",
        "year": "4th Year (B.Tech)",
        "studentId": "EC2022-089",
        "priorityScore": 7.6,
        "priorityLevel": "urgent",
        "moodTrend": "declining",
        "stressScore": 9,
        "sleepHours": 4.0,
        "academicEngagement": "low",
        "attendanceRate": 64,
        "lastActivity": "3 hours ago",
        "counselorAssigned": "Dr. Ananya Sharma",
        "primarySignals": ["Placement season anxiety", "Severe sleep restriction", "Project deadline backlog"],
        "summaryNote": "High placement stress combined with project submission pressures."
    }
]

INITIAL_CHECKINS = [
    {
        "id": "chk-1",
        "studentId": "CS2023-042",
        "studentName": "Aarohi Verma",
        "mood": "Overwhelmed",
        "stress": 8,
        "sleep": 4.5,
        "notes": "Late night studying for Data Structures lab report.",
        "timestamp": "2026-08-30 09:30 AM"
    }
]

INITIAL_INTERVENTIONS = [
    {
        "id": "int-1",
        "studentId": "std-2",
        "type": "academic_support",
        "date": "2026-08-27",
        "notes": "Scheduled academic peer tutoring session for Thermodynamics and provided exam stress reduction techniques.",
        "followUpDate": "2026-09-03",
        "outcome": "improving",
        "scheduledBy": "Dr. Ananya Sharma"
    }
]

INITIAL_FACULTY_REQUESTS = [
    {
        "id": "req-101",
        "studentId": "std-1",
        "studentName": "Aarohi Verma",
        "department": "Computer Science & Engineering",
        "course": "CS301: Algorithms & Data Structures",
        "facultyName": "Prof. Ramesh Verma",
        "facultyId": "fac-1",
        "counselorName": "Dr. Ananya Sharma",
        "requestedDate": "2026-08-26",
        "status": "pending",
        "dueDate": "2026-08-29",
        "guidanceNote": "Please observe classroom participation, group lab interaction, and overall attentiveness."
    }
]

INITIAL_FACULTY_OBSERVATIONS = [
    {
        "id": "obs-201",
        "requestId": "req-102",
        "studentId": "std-2",
        "facultyName": "Prof. Ramesh Verma",
        "course": "ME204: Thermodynamics",
        "changeDetected": "slight",
        "participation": "reduced",
        "academicEngagement": "reduced",
        "peerInteraction": "normal",
        "contextualNotes": "Rohan missed two tutorial discussions and appeared distracted during the last session.",
        "submittedAt": "2026-08-27 11:30 AM"
    }
]

class LocalDB:
    def __init__(self):
        os.makedirs(DATA_DIR, exist_ok=True)
        if not os.path.exists(DB_FILE):
            self.data = {
                "users": INITIAL_USERS,
                "students": INITIAL_STUDENTS,
                "checkins": INITIAL_CHECKINS,
                "interventions": INITIAL_INTERVENTIONS,
                "faculty_requests": INITIAL_FACULTY_REQUESTS,
                "faculty_observations": INITIAL_FACULTY_OBSERVATIONS
            }
            self.save()
        else:
            try:
                with open(DB_FILE, "r", encoding="utf-8") as f:
                    self.data = json.load(f)
            except Exception as e:
                logger.error("Failed to load db.json: %s. Re-initializing seed.", e)
                self.data = {
                    "users": INITIAL_USERS,
                    "students": INITIAL_STUDENTS,
                    "checkins": INITIAL_CHECKINS,
                    "interventions": INITIAL_INTERVENTIONS,
                    "faculty_requests": INITIAL_FACULTY_REQUESTS,
                    "faculty_observations": INITIAL_FACULTY_OBSERVATIONS
                }
                self.save()

    def save(self):
        try:
            with open(DB_FILE, "w", encoding="utf-8") as f:
                json.dump(self.data, f, indent=2)
        except Exception as e:
            logger.error("Failed to save db.json: %s", e)

db = LocalDB()

# ---------------------------------------------------------------------------
# AI Client Setup (Google Gemini API)
# ---------------------------------------------------------------------------
_GENAI_AVAILABLE = False
_genai_client = None
_genai_legacy = None

def init_genai():
    global _GENAI_AVAILABLE, _genai_client, _genai_legacy
    key = os.environ.get("GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or ""
    if key and key != "your_gemini_api_key_here":
        try:
            from google import genai as _google_genai
            _genai_client = _google_genai.Client(api_key=key)
            _GENAI_AVAILABLE = True
            logger.info("Connected to Google GenAI Client.")
            return
        except Exception as exc:
            logger.debug("google-genai modern client failed: %s. Trying legacy google-generativeai...", exc)

        try:
            import google.generativeai as genai_legacy
            genai_legacy.configure(api_key=key)
            _genai_legacy = genai_legacy
            _GENAI_AVAILABLE = True
            logger.info("Connected to Legacy Google GenerativeAI Client.")
            return
        except Exception as exc:
            logger.warning("google.generativeai legacy init failed: %s", exc)

    _GENAI_AVAILABLE = False

init_genai()

SYSTEM_PROMPT = (
    "You are MannMitra, an intelligent, warm, and deeply empathetic AI peer companion for Indian university students. "
    "You communicate like a real, thoughtful friend and supportive listener—conversational, natural, engaging, and clear, "
    "similar to how ChatGPT or a compassionate counselor assistant speaks. "
    "You never diagnose or act as a licensed medical authority, but you provide genuine emotional validation, practical "
    "coping advice, and actionable guidance for academic stress, sleep difficulties, peer anxiety, or emotional fatigue. "
    "Always maintain context from previous turns in the conversation. Keep your tone encouraging, human, and comforting, "
    "without sounding like a canned automated script or a rigid textbook. "
    "If campus resources or coping techniques (like 4-7-8 breathing, 5-4-3-2-1 grounding, or Pomodoro blocks) are relevant, "
    "weave them naturally into your response."
)

logger.info("Loading RiskAnalyzer...")
analyzer = RiskAnalyzer()

logger.info("Loading RAGEngine...")
rag_engine = RAGEngine()

# ---------------------------------------------------------------------------
# Smart Reply Synthesizer with Multi-Model Gemini LLM Fallbacks
# ---------------------------------------------------------------------------
def generate_reply(user_text: str, chat_history: List[dict], rag_context: RAGContext) -> str:
    init_genai()
    
    if _GENAI_AVAILABLE:
        context_note = ""
        if rag_context.is_used and rag_context.retrieved_documents:
            joined = "\n\n".join(rag_context.retrieved_documents[:2])
            context_note = (
                "\n\n[Retrieved Campus Knowledge & Coping Guide Context]:\n"
                f"{joined}\n"
                "(Weave these strategies smoothly into your reply as friendly suggestions where appropriate.)"
            )

        convo_lines = []
        for turn in chat_history[-6:]:
            role = "Student" if turn.get("role") == "user" else "MannMitra"
            convo_lines.append(f"{role}: {turn.get('content', '')}")
        convo_text = "\n".join(convo_lines)

        full_prompt = (
            f"{SYSTEM_PROMPT}\n\n"
            f"Conversation History:\n{convo_text}\n\n"
            f"Student: {user_text}"
            f"{context_note}\n\n"
            "MannMitra:"
        )

        # 1. Try modern google-genai SDK across model fallbacks
        if _genai_client is not None:
            models_to_try = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.5-flash"]
            for model_name in models_to_try:
                try:
                    response = _genai_client.models.generate_content(
                        model=model_name,
                        contents=full_prompt,
                    )
                    text = (response.text or "").strip()
                    if text:
                        logger.info("Generated LLM response using model: %s", model_name)
                        return text
                except Exception as exc:
                    logger.debug("GenAI model %s failed: %s", model_name, exc)

        # 2. Try legacy google.generativeai SDK
        if _genai_legacy is not None:
            models_to_try = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]
            for model_name in models_to_try:
                try:
                    model = _genai_legacy.GenerativeModel(model_name)
                    response = model.generate_content(full_prompt)
                    text = (response.text or "").strip()
                    if text:
                        logger.info("Generated Legacy LLM response using model: %s", model_name)
                        return text
                except Exception as exc:
                    logger.debug("Legacy GenAI model %s failed: %s", model_name, exc)

        # 3. Direct HTTP REST API Fallback
        key = os.environ.get("GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY") or ""
        if key:
            try:
                import requests
                rest_models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-flash-latest", "gemini-pro"]
                for rm in rest_models:
                    for ver in ["v1beta", "v1"]:
                        url = f"https://generativelanguage.googleapis.com/{ver}/models/{rm}:generateContent?key={key}"
                        payload = {"contents": [{"parts": [{"text": full_prompt}]}]}
                        resp = requests.post(url, json=payload, timeout=10)
                        if resp.status_code == 200:
                            res_json = resp.json()
                            candidates = res_json.get("candidates", [])
                            if candidates:
                                parts = candidates[0].get("content", {}).get("parts", [])
                                if parts and "text" in parts[0]:
                                    logger.info("Generated LLM response via direct REST API model: %s (%s)", rm, ver)
                                    return parts[0]["text"].strip()
            except Exception as e:
                logger.debug("Direct REST API call exception: %s", e)

    # --- Smart Fallback Generator matching User Intent ---
    lowered = user_text.lower()
    
    # 1. Sleep & Rest Intent
    if any(k in lowered for k in ["sleep", "tired", "insomnia", "exhausted", "rest", "bed", "awake", "night"]):
        return (
            "I hear how exhausting it is when you're sleepy but your body just won't let you sleep. "
            "Try putting away screens, dimming the lights, and focusing on a gentle slow exhale to relax your nervous system. "
            "Would you like to try a quick progressive muscle relaxation technique?"
        )

    # 2. Anxiety & Panic Intent
    if any(k in lowered for k in ["panic", "breathe", "chest", "anxious", "anxiety", "scared", "fear", "shaking", "grounding"]):
        return (
            "When anxiety or panic surges, it helps to pause and anchor your senses in the room. "
            "Try taking a slow breath and naming 5 objects around you or placing a cold hand on your wrist. "
            "Take all the time you need — I'm right here with you."
        )

    # 3. Academic & Exam Intent
    if any(k in lowered for k in ["exam", "study", "marks", "grade", "backlog", "assignment", "deadline", "paralysis", "syllabus"]):
        return (
            "Exam backlogs and academic pressure can feel like a heavy weight, but you don't have to tackle everything at once. "
            "Try breaking your study list into tiny 15-minute Pomodoro focus blocks with short breaks in between. "
            "What is one tiny task you can start with today?"
        )

    # 4. Counseling & Crisis Intent
    if any(k in lowered for k in ["counselor", "helpline", "tele-manas", "kiran", "support"]):
        return (
            "It takes real strength to recognize when things feel like too much. "
            "Campus wellness services and 24/7 helplines like Tele-MANAS (14416) are free, confidential, and always ready to listen. "
            "Would you like guidance on reaching out to a campus counselor?"
        )

    # 5. Default Empathetic Response
    return (
        "Thank you for sharing how you're feeling. "
        "Your feelings are completely valid — take a deep breath and tell me a little bit more about what's on your mind."
    )

    # Contextual empathetic defaults based on user text
    if any(k in lowered for k in ["exam", "study", "marks", "grade", "fail", "backlog"]):
        return (
            "Academic pressure can feel really intense, but your worth is so much more than a grade. "
            "Let's break your workload into manageable pieces so you don't feel overwhelmed. "
            "How can we tackle this step by step today?"
        )
    elif any(k in lowered for k in ["sleep", "tired", "insomnia", "exhausted"]):
        return (
            "Getting quality rest is so important when your mind is working overtime. "
            "Try disconnecting from screens 30 minutes before bed and practicing a few deep breaths. "
            "How many hours of sleep have you been getting lately?"
        )
    elif any(k in lowered for k in ["lonely", "alone", "sad", "down"]):
        return (
            "I hear you, and it's completely valid to feel this way. Please remember that you aren't alone in this journey. "
            "I'm here to listen whenever you need a safe space to share."
        )

    return (
        "I hear you, and I'm really glad you shared that with me. "
        "Your feelings are completely valid — tell me a little bit more about what's been on your mind."
    )


# ---------------------------------------------------------------------------
# Flask App Setup
# ---------------------------------------------------------------------------
app = Flask(__name__)
CORS(app, origins=["*"])

_history_scores: Dict[str, List[float]] = {}


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "genai_active": _GENAI_AVAILABLE,
        "chroma_ready": getattr(rag_engine, "_chroma_ready", False),
        "registered_users": len(db.data["users"]),
        "students_count": len(db.data["students"])
    })


# ---------------------------------------------------------------------------
# MannMitra Chat Endpoint
# ---------------------------------------------------------------------------
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(force=True, silent=True) or {}
    user_text: str = (data.get("message") or "").strip()
    session_id: str = data.get("session_id") or "default"
    history: List[dict] = data.get("history") or []

    if not user_text:
        return jsonify({"error": "message is required"}), 400

    past_scores = _history_scores.get(session_id, [])
    emotion, assessment = analyzer.assess_risk(user_text, past_scores)

    past_scores = (past_scores + [assessment.score])[-10:]
    _history_scores[session_id] = past_scores

    if assessment.is_crisis:
        reply = RiskAnalyzer.get_crisis_response()
        rag_context = RAGContext(is_used=False)
    else:
        rag_context = rag_engine.retrieve(user_text, assessment.score)
        reply = generate_reply(user_text, history, rag_context)

    return jsonify({
        "reply": reply,
        "tier": assessment.tier,
        "distress_score": round(assessment.score, 4),
        "emotion": emotion.label,
        "is_crisis": assessment.is_crisis,
        "rag_used": rag_context.is_used,
        "rag_sources": rag_context.sources,
    })


# ---------------------------------------------------------------------------
# Auth Endpoints
# ---------------------------------------------------------------------------
@app.route("/api/auth/login", methods=["POST"])
def auth_login():
    data = request.get_json(force=True, silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    role = data.get("role") or "student"

    users = db.data.get("users", [])
    account = next((u for u in users if u.get("email", "").lower() == email), None)

    if not account:
        return jsonify({
            "success": False,
            "error": 'No account registered with this email. Click "Create Account" to register.'
        }), 404

    if account.get("password") and account.get("password") != password:
        return jsonify({
            "success": False,
            "error": "Incorrect password. Please verify your password and try again."
        }), 401

    if account.get("role") != role:
        return jsonify({
            "success": False,
            "error": f"This email is registered for the {account.get('role').upper()} portal."
        }), 403

    user_profile = {k: v for k, v in account.items() if k != "password"}
    return jsonify({"success": True, "user": user_profile})


@app.route("/api/auth/register", methods=["POST"])
def auth_register():
    data = request.get_json(force=True, silent=True) or {}
    full_name = (data.get("fullName") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    role = data.get("role") or "student"

    if not email or not password:
        return jsonify({"success": False, "error": "Email and password are required."}), 400

    users = db.data.get("users", [])
    if any(u.get("email", "").lower() == email for u in users):
        return jsonify({"success": False, "error": "An account with this email already exists."}), 409

    gen_name = full_name or email.split("@")[0].capitalize()
    gen_student_id = f"CS2026-{1000 + len(users)}"

    new_user = {
        "id": f"usr-{Date_now()}",
        "name": gen_name,
        "email": email,
        "password": password,
        "role": role,
        "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={email}",
        "title": "Student" if role == "student" else "Counselor" if role == "counselor" else "Campus Admin",
        "department": "Computer Science & Engineering",
        "studentId": gen_student_id if role == "student" else None
    }

    users.append(new_user)
    db.data["users"] = users

    # If student, ensure student profile exists in students db
    if role == "student":
        students = db.data.get("students", [])
        if not any(s.get("studentId") == gen_student_id for s in students):
            new_student = {
                "id": new_user["id"],
                "name": gen_name,
                "avatar": new_user["avatar"],
                "department": new_user["department"],
                "year": "1st Year",
                "studentId": gen_student_id,
                "priorityScore": 1.8,
                "priorityLevel": "stable",
                "moodTrend": "improving",
                "stressScore": 3,
                "sleepHours": 7.8,
                "academicEngagement": "normal",
                "attendanceRate": 95,
                "lastActivity": "Just now",
                "counselorAssigned": "Dr. Ananya Sharma",
                "primarySignals": ["Active Student Session", "Consistent Check-ins"],
                "summaryNote": "Registered student account active in MannMitra system."
            }
            students.insert(0, new_student)
            db.data["students"] = students

    db.save()
    user_profile = {k: v for k, v in new_user.items() if k != "password"}
    return jsonify({"success": True, "user": user_profile})


def Date_now():
    import time
    return int(time.time() * 1000)


# ---------------------------------------------------------------------------
# Student & Checkin Endpoints
# ---------------------------------------------------------------------------
@app.route("/api/students", methods=["GET"])
def get_students():
    return jsonify({"success": True, "students": db.data.get("students", [])})


@app.route("/api/students/<student_id>", methods=["GET"])
def get_student_detail(student_id: str):
    students = db.data.get("students", [])
    std = next((s for s in students if s.get("id") == student_id or s.get("studentId") == student_id), None)
    if not std:
        return jsonify({"success": False, "error": "Student not found"}), 404
    return jsonify({"success": True, "student": std})


@app.route("/api/checkins", methods=["POST"])
def create_checkin():
    data = request.get_json(force=True, silent=True) or {}
    student_id = data.get("studentId") or "CS2023-042"
    student_name = data.get("studentName") or "Student"
    mood = data.get("mood") or "Okay"
    stress = float(data.get("stress", 5))
    sleep = float(data.get("sleep", 7))
    notes = data.get("notes") or ""

    checkin_obj = {
        "id": f"chk-{Date_now()}",
        "studentId": student_id,
        "studentName": student_name,
        "mood": mood,
        "stress": stress,
        "sleep": sleep,
        "notes": notes,
        "timestamp": "Today"
    }

    checkins = db.data.get("checkins", [])
    checkins.insert(0, checkin_obj)
    db.data["checkins"] = checkins

    # Dynamically update student priority score & mood trend in database!
    students = db.data.get("students", [])
    for s in students:
        if s.get("id") == student_id or s.get("studentId") == student_id or s.get("name").lower() == student_name.lower():
            s["stressScore"] = stress
            s["sleepHours"] = sleep
            s["lastActivity"] = "Just now"

            # Priority calculation logic
            calc_priority = round(min(10.0, (stress * 0.7) + ((8.0 - min(8.0, sleep)) * 0.5)), 1)
            s["priorityScore"] = calc_priority
            s["priorityLevel"] = "urgent" if calc_priority >= 7.5 else "moderate" if calc_priority >= 5.0 else "stable"
            s["moodTrend"] = "declining" if stress >= 7 else "improving" if stress <= 4 else "stable"
            break

    db.data["students"] = students
    db.save()

    return jsonify({"success": True, "checkin": checkin_obj})


@app.route("/api/checkins/<student_id>", methods=["GET"])
def get_checkins(student_id: str):
    checkins = db.data.get("checkins", [])
    filtered = [c for c in checkins if c.get("studentId") == student_id]
    return jsonify({"success": True, "checkins": filtered})


# ---------------------------------------------------------------------------
# Counselor & Intervention Endpoints
# ---------------------------------------------------------------------------
@app.route("/api/interventions", methods=["GET"])
def get_interventions():
    return jsonify({"success": True, "interventions": db.data.get("interventions", [])})


@app.route("/api/interventions", methods=["POST"])
def record_intervention():
    data = request.get_json(force=True, silent=True) or {}
    student_id = data.get("studentId")
    if not student_id:
        return jsonify({"success": False, "error": "studentId is required"}), 400

    new_int = {
        "id": f"int-{Date_now()}",
        "studentId": student_id,
        "type": data.get("type", "counseling_session"),
        "date": data.get("date", "2026-08-30"),
        "notes": data.get("notes", ""),
        "followUpDate": data.get("followUpDate", ""),
        "outcome": data.get("outcome", "improving"),
        "scheduledBy": data.get("scheduledBy", "Counselor")
    }

    interventions = db.data.get("interventions", [])
    interventions.insert(0, new_int)
    db.data["interventions"] = interventions

    # Update student record note
    for s in db.data.get("students", []):
        if s.get("id") == student_id or s.get("studentId") == student_id:
            s["lastActivity"] = "Intervention scheduled"
            s["summaryNote"] = f"Scheduled {new_int['type']} support session."
            break

    db.save()
    return jsonify({"success": True, "intervention": new_int})


@app.route("/api/faculty-requests", methods=["GET", "POST"])
def faculty_requests():
    if request.method == "GET":
        return jsonify({"success": True, "facultyRequests": db.data.get("faculty_requests", [])})
    
    data = request.get_json(force=True, silent=True) or {}
    req_id = data.get("id")
    status = data.get("status")

    requests_list = db.data.get("faculty_requests", [])
    for r in requests_list:
        if r.get("id") == req_id:
            r["status"] = status
            break

    db.data["faculty_requests"] = requests_list
    db.save()
    return jsonify({"success": True, "facultyRequests": requests_list})


# ---------------------------------------------------------------------------
# Server Startup
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    logger.info("MannMitra API listening on http://localhost:%d", port)
    app.run(host="0.0.0.0", port=port, debug=False)
