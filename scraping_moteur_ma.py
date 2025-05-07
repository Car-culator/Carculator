import requests
from bs4 import BeautifulSoup
import csv
import time

# URL de base et URL de recherche
BASE_URL = 'https://www.moteur.ma'
SEARCH_URL = 'https://www.moteur.ma/fr/voiture/achat-voiture-occasion/'

# En-têtes HTTP pour imiter un navigateur et éviter le blocage
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
}

def get_links(page_url):
    """
    Récupère les liens des annonces de voitures sur une page donnée.
    """
    try:
        response = requests.get(page_url, headers=HEADERS)
        response.raise_for_status()  # Vérifie si la requête a réussi
        soup = BeautifulSoup(response.content, 'html.parser')

        links = set()  # Utilisation d'un set pour éviter les doublons
        cards = soup.find_all('div', class_='row-item row-item-checkout link')

        for card in cards:
            link_tag = card.find('a')
            if link_tag and 'href' in link_tag.attrs:
                full_link = BASE_URL + link_tag['href'] if not link_tag['href'].startswith('http') else link_tag['href']
                links.add(full_link)

        return list(links)

    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de la récupération des liens depuis {page_url}: {e}")
        return []

def get_car_details(car_url):
    """
    Extrait les détails d'une annonce de voiture à partir de son URL.
    """
    try:
        response = requests.get(car_url, headers=HEADERS)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        data = {}

        # Extraction du nom et du prix du véhicule
        current_page = soup.find('li', class_='curent-page')
        if current_page:
            parts = current_page.text.strip().split(',')
            data['Nom du véhicule'] = parts[0].strip() if len(parts) >= 1 else None
            data['Prix'] = parts[1].strip() if len(parts) >= 2 else None
        else:
            data['Nom du véhicule'] = None
            data['Prix'] = None

        # Extraction des détails techniques
        for detail in soup.find_all('div', class_='detail_line'):
            label = detail.find('span', class_='col-md-6 col-xs-6')
            value = detail.find('span', class_='text_bold')
            if label and value:
                data[label.text.strip()] = value.text.strip()

        return data

    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de la récupération de {car_url}: {e}")
        return None

def save_to_csv(data, filename='car_data.csv'):
    """
    Sauvegarde les données dans un fichier CSV.
    """
    if not data:
        print("Aucune donnée à sauvegarder.")
        return

    # Déterminer toutes les clés possibles
    fieldnames = set()
    for entry in data:
        fieldnames.update(entry.keys())

    # Écriture dans un fichier CSV
    with open(filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        for entry in data:
            writer.writerow(entry)

# Liste pour stocker les données de toutes les annonces
all_data = []

# Scraping des annonces sur plusieurs pages
start_page = 0
max_pages = 21510 

while start_page <= max_pages:
    page_url = f"{SEARCH_URL}{start_page}"
    print(f"Scraping des annonces depuis : {page_url}")

    links = get_links(page_url)

    for link in links:
        car_data = get_car_details(link)
        if car_data:
            all_data.append(car_data)
        time.sleep(1) 

    start_page += 30  # Incrémentation pour passer à la page suivante

# Sauvegarde des résultats dans un fichier CSV
save_to_csv(all_data)
print(f"Données sauvegardées dans 'car_data.csv'")