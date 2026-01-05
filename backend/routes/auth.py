from flask import Blueprint, request, jsonify
from firebase import db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    db.collection("users").add(data)
    return jsonify({"message": "User registered"})
