from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)
CORS(app)

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

@app.route("/")
def home():
    return jsonify({
        "status": "FoodRescue backend running ✅"
    })
@app.route("/donations", methods=["POST"])
def add_donation():
    data = request.json
    db.collection("donations").add(data)
    return jsonify({"message": "Donation added"}), 201

@app.route("/donations", methods=["GET"])
def get_donations():
    provider = request.args.get("provider")
    docs = db.collection("donations").stream()

    donations = []
    for doc in docs:
        d = doc.to_dict()
        if provider and d.get("providerName") != provider:
            continue
        d["id"] = doc.id
        donations.append(d)

    return jsonify(donations)

if __name__ == "__main__":
    app.run(debug=True)
