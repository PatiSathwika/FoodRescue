from flask import Blueprint, jsonify
from firebase import db

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/stats")
def stats():
    donations = list(db.collection("donations").stream())
    total_kg = sum(d.to_dict().get("quantity", 0) for d in donations)
    return jsonify({
        "total_donations": len(donations),
        "total_kg": total_kg
    })
