# backend/app/services/mongo_service.py
"""
MongoDB connection service.
Using local connection string for development/hackathon demo.
"""
import os
from datetime import datetime
from typing import Optional, Dict, Any
from pymongo import MongoClient, DESCENDING
from pymongo.errors import ConnectionFailure

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME   = "accel_saathi"

_client: Optional[MongoClient] = None

def _get_client() -> MongoClient:
    global _client
    if _client is None:
        _client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
    return _client

def get_db():
    return _get_client()[DB_NAME]

def is_connected() -> bool:
    try:
        _get_client().admin.command("ping")
        return True
    except Exception:
        return False

# ── Orders collection helpers ──────────────────────────────────────────────────

def insert_order(order: Dict[str, Any]) -> str:
    """Insert a new order document and return the generated order_id."""
    db = get_db()
    result = db.orders.insert_one(order)
    return str(result.inserted_id)

def get_order_by_id(order_id: str) -> Optional[Dict[str, Any]]:
    db = get_db()
    from bson import ObjectId
    try:
        doc = db.orders.find_one({"_id": ObjectId(order_id)})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc
    except Exception:
        return None

def get_all_orders(limit: int = 50) -> list:
    db = get_db()
    docs = list(db.orders.find().sort("created_at", DESCENDING).limit(limit))
    for d in docs:
        d["_id"] = str(d["_id"])
    return docs

def get_order_by_ref(order_ref: str) -> Optional[Dict[str, Any]]:
    db = get_db()
    doc = db.orders.find_one({"order_ref": order_ref})
    if doc:
        doc["_id"] = str(doc["_id"])
    return doc

def update_order_stage(order_id: str, stage_update: Dict[str, Any]):
    db = get_db()
    from bson import ObjectId
    db.orders.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"updated_at": datetime.utcnow(), **stage_update}}
    )
