from flask import Flask, render_template, request, jsonify
import pickle
import numpy as np

app = Flask(__name__)

# Charger modèle et outils
model = pickle.load(open(r"C:\Users\Mouad tace\Desktop\proget de vehicule\nicelook\rf_model.pkl", "rb"))
marque_encoder = pickle.load(open(r"C:\Users\Mouad tace\Desktop\proget de vehicule\nicelook\marque_encoder.pkl", "rb"))
modele_encoder = pickle.load(open(r"C:\Users\Mouad tace\Desktop\proget de vehicule\nicelook\modele_encoder.pkl", "rb"))
scaler = pickle.load(open(r"C:\Users\Mouad tace\Desktop\proget de vehicule\nicelook\scaler.pkl", "rb"))

# Encodage carburant
def encode_carburant(carburant):
    c = carburant.lower()
    return [
        int(c == "diesel"),
        int(c == "electrique"),
        int(c == "essence"),
        int(c == "hybride")
    ]

# Encodage boîte
def encode_boite(boite):
    return int(boite.lower() == "manuelle")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict_ajax", methods=["POST"])
def predict_ajax():
    data = request.json

    try:
        marque = data["marque"].strip().lower()
        modele = data["modele"].strip().lower()
        annee = int(data["annee"])
        pf = float(data["pf"])
        km = float(data["km"])
        carburant = data["carburant"]
        boite = data["boite"]

        marque_encoded = marque_encoder.transform([marque])[0]
        modele_encoded = modele_encoder.transform([modele])[0]
        carburant_encoded = encode_carburant(carburant)
        boite_encoded = encode_boite(boite)
        km_scaled, pf_scaled = scaler.transform([[km, pf]])[0]

        features = [[
            marque_encoded, modele_encoded, annee,
            km_scaled, pf_scaled,
            *carburant_encoded, boite_encoded
        ]]
        prediction = model.predict(features)[0]
        return jsonify({"prix": round(prediction, 2)})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
