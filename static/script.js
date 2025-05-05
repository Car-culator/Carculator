// Variables globales
let selectedCar = null
let selectedFuel = null
let transmission = "Manuel"
let puissance = 5
let kilometrage = 50000

// Éléments DOM
const carLogos = document.querySelectorAll(".car-logo")
const carFormModal = document.getElementById("carFormModal")
const fuelModal = document.getElementById("fuelModal")
const carTitle = document.getElementById("carTitle")
const closeCarForm = document.getElementById("closeCarForm")
const fuelSelectBtn = document.getElementById("fuelSelectBtn")
const fuelDisplay = document.getElementById("fuelDisplay")
const cancelFuel = document.getElementById("cancelFuel")
const puissanceSlider = document.getElementById("puissanceSlider")
const puissanceValue = document.getElementById("puissanceValue")
const kmSlider = document.getElementById("kmSlider")
const kmValue = document.getElementById("kmValue")
const transmissionToggle = document.getElementById("transmissionToggle")
const manualLabel = document.getElementById("manualLabel")
const autoLabel = document.getElementById("autoLabel")
const submitBtn = document.getElementById("submitBtn")
const resetBtn = document.getElementById("resetBtn")
const currentYear = document.getElementById("currentYear")
const socialMenu = document.querySelector(".social-share .menu")
const socialToggle = document.querySelector(".social-share .toggle")

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  // Afficher l'année courante dans le footer
  currentYear.textContent = new Date().getFullYear()

  // Initialiser les événements
  initEvents()
})

// Fonction pour réinitialiser le formulaire
function resetForm() {
  // Réinitialiser les champs de texte
  document.getElementById("carType").value = ""
  document.getElementById("carModel").value = ""

  // Réinitialiser le carburant
  selectedFuel = null
  fuelDisplay.textContent = "Sélectionner un carburant"

  // Réinitialiser la puissance
  puissance = 5
  puissanceSlider.value = 5
  puissanceValue.textContent = "5"

  // Réinitialiser le kilométrage
  kilometrage = 50000
  kmSlider.value = 50000
  kmValue.textContent = "50000"

  // Réinitialiser la transmission
  transmission = "Manuel"
  transmissionToggle.checked = false
  manualLabel.classList.add("active")
  autoLabel.classList.remove("active")

  // Réinitialiser le bouton de soumission
  submitBtn.textContent = "Estimer le prix"
  submitBtn.style.backgroundColor = ""
  submitBtn.disabled = false
}

// Initialiser les événements
function initEvents() {
  // Ajouter les événements de clic pour chaque logo de voiture
  carLogos.forEach((logo) => {
    logo.addEventListener("click", () => {
      selectCar(logo.getAttribute("data-car"))
    })
  })

  // Fermer le formulaire de voiture
  closeCarForm.addEventListener("click", () => {
    carFormModal.classList.remove("active")
  })

  // Bouton de réinitialisation
  resetBtn.addEventListener("click", resetForm)

  // Ouvrir le modal de sélection de carburant
  fuelSelectBtn.addEventListener("click", () => {
    fuelModal.classList.add("active")
  })

  // Fermer le modal de carburant
  cancelFuel.addEventListener("click", () => {
    fuelModal.classList.remove("active")
  })

  // Sélection du carburant
  document.querySelectorAll(".fuel-option").forEach((option) => {
    option.addEventListener("click", () => {
      selectedFuel = option.getAttribute("data-fuel")
      fuelDisplay.textContent = selectedFuel
      fuelModal.classList.remove("active")
    })
  })

  // Mise à jour de la puissance
  puissanceSlider.addEventListener("input", () => {
    puissance = Number.parseInt(puissanceSlider.value)
    puissanceValue.textContent = puissance
  })

  // Mise à jour du kilométrage
  kmSlider.addEventListener("input", () => {
    kilometrage = Number.parseInt(kmSlider.value)
    kmValue.textContent = kilometrage.toLocaleString()
  })

  // Basculer la transmission
  transmissionToggle.addEventListener("change", () => {
    if (transmissionToggle.checked) {
      transmission = "Automatique"
      manualLabel.classList.remove("active")
      autoLabel.classList.add("active")
    } else {
      transmission = "Manuel"
      autoLabel.classList.remove("active")
      manualLabel.classList.add("active")
    }
  })

  // Soumettre le formulaire
  submitBtn.addEventListener("click", submitCar)

  // Fermer les modals en cliquant sur l'overlay
  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", () => {
      carFormModal.classList.remove("active")
      fuelModal.classList.remove("active")
    })
  })

  // Menu de partage social
  if (socialToggle) {
    socialToggle.addEventListener("click", () => {
      socialMenu.classList.toggle("active")
    })
  }
}

// Sélectionner une voiture
function selectCar(car) {
  selectedCar = car
  carTitle.textContent = car
  carFormModal.classList.add("active")
  resetForm() // Réinitialiser le formulaire à chaque ouverture
}

// Soumettre le formulaire
async function submitCar() {
  const carType = document.getElementById("carType").value
  const carModel = document.getElementById("carModel").value

  if (!selectedCar || !carType || !carModel || !selectedFuel) {
    alert("Veuillez remplir tous les champs.")
    return
  }

  const data = {
    marque: selectedCar,
    modele: carType,
    annee: carModel,
    km: kilometrage,
    pf: puissance,
    carburant: selectedFuel,
    boite: transmission,
  }

  try {
    const response = await fetch("/predict_ajax", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    const submitButton = document.getElementById("submitBtn")

    if (result.error) {
      submitButton.textContent = "Erreur !"
      submitButton.style.backgroundColor = "red"
    } else {
      const formattedPrice = Number(result.prix).toLocaleString("fr-FR")
      submitButton.textContent = `Prix estimé : ${formattedPrice} MAD`
    }

    submitButton.disabled = true // désactiver le bouton après la prédiction
  } catch (error) {
    console.error("Erreur:", error)
    const submitButton = document.getElementById("submitBtn")
    submitButton.textContent = "Erreur !"
    submitButton.style.backgroundColor = "red"
  }
}
