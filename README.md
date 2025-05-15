<p align="center">
  <img src="static/git__logo.png" alt="Carculator Logo"/>
</p>

# Carculator

**Carculator** est une application web qui prédit le prix des voitures d'occasion au Maroc à partir de données saisies par l'utilisateur. Le projet utilise un modèle d'apprentissage automatique entraîné sur des données extraites du site Moteur.ma.

## 📁 Structure du projet

```
carculator/
│
├── app.py                   # Application Flask principale
├── EDA_Training.ipynb       # Analyse exploratoire et entraînement du modèle
├── scraping_moteur_ma.py    # Script de scraping de données depuis Moteur.ma
│
├── marque_encoder.pkl       # Encodage des marques
├── modele_encoder.pkl       # Encodage des modèles
├── scaler.pkl               # StandardScaler pour les données numériques
├── rf_model_op.joblib       # Modèle Random Forest entraîné
│
├── static/                  # Fichiers CSS et JS
├── templates/               # Templates HTML (interface utilisateur)
│
├── LICENSE                  # Licence du projet
├── .gitignore               # Fichiers ignorés par Git
├── requirements.txt         # Les bibliothèques requises
└── README.md                # Ce fichier
```

## 🧠 Technologies

* **Python 3.10+**
* **Flask** pour créer l'interface web
* **scikit-learn** pour le machine learning
* **Pandas / NumPy** pour la manipulation de données
* **BeautifulSoup** pour le scraping web
* **HTML / CSS / JS** (dans `templates/` et `static/`)

## 🚀 Fonctionnalités

* Prédiction du prix d'un véhicule d'occasion basé sur :
   * Marque, modèle, année
   * Kilométrage, puissance fiscale
   * Type de carburant et boîte de vitesses
* Interface web conviviale (Flask)
* Traitement des données encodées et normalisées
* Modèle RandomForest pour des prédictions robustes

## 🛠️ Installation

1. Clone le dépôt :

```bash
git clone https://github.com/hajar-elkhalidi/carculator.git
cd carculator
```

2. Crée un environnement virtuel :

```bash
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate sous Windows
```

3. Installe les dépendances :

```bash
pip install -r requirements.txt
```

## ⚙️ Lancer l'application

```bash
python app.py
```

Ouvre ton navigateur à l'adresse : http://127.0.0.1:5000

## 📊 Entraînement du modèle

L'entraînement et la préparation du modèle sont réalisés dans le fichier `EDA_Training.ipynb`. Ce notebook contient :
* L'analyse exploratoire des données
* Le prétraitement (encodage, scaling)
* L'entraînement du modèle RandomForest
* L'exportation du modèle et des transformateurs (`.pkl`, `.joblib`)

## 🕵️‍♀️ Auteurs

* **Aminata KIMBIRI** 
* **Hajar EL KHALIDI**
* **Mouad TACE** 
> Étudiant.e.s en Intelligence Artificielle, passionné.e.s par le Machine Learning et le développement web.


## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier LICENSE pour plus d'informations.
