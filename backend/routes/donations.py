from flask import Blueprint, request, jsonify
from firebase import db

donations_bp = Blueprint("donations", __name__)

@donations_bp.route("/", methods=["POST"])
def add_donation():
    data = request.json
    db.collection("donations").add(data)
    return jsonify({"message": "Donation added"})

@donations_bp.route("/", methods=["GET"])
def get_donations():
    docs = db.collection("donations").stream()
    donations = [{**doc.to_dict(), "id": doc.id} for doc in docs]
    return jsonify(donations)
