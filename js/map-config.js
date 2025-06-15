// map-config.js - Configuration globale et initialisation de la carte

// Variables globales
let map;
let baseMaps;
let basemapLayer; 
let allPoints = [];
let mainClusterGroup;
let activeFilters = {
  types: [],
  source: '',
  density: 0,
  user: ''
};

// Configuration du CDN - définie ici pour être accessible à tous les scripts
//window.CDN_BASE_URL = 'https://raw.githubusercontent.com/Gilles-Segura/CARTO-DATA-CDN/main/script/data';
window.CDN_BASE_URL = 'https://gilles-segura.github.io/CARTO-DATA-CDN/script/data';

// Types de barrières disponibles
window.BARRIER_TYPES = ['dam', 'weir', 'sluice', 'culvert', 'ford', 'other', 'ramp'];

// Couleurs pour différents types de barrières
const typeColors = {};
const colorList = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'];
let colorIndex = 0;
const iconCache = {};

// Initialisation de la carte
function initMap() {
  console.log("Initialisation de la carte");
  
  // Définition des différentes couches de carte
  baseMaps = {
    "Street": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),
    "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
      maxZoom: 19
    })
  };

  // Initialisation de la carte avec la couche Street par défaut
  map = L.map('map', {
    center: [46.5, 2.5],
    zoom: 6,
    layers: [baseMaps.Street]
  }).setView([46.5, 2.5], 6);
  
  // Stocker la couche de base active
  basemapLayer = baseMaps.Street;

  // Ajout du contrôle de couches en haut à droite de la carte
  L.control.layers(baseMaps, null, {position: 'topright'}).addTo(map);
  
  // Initialiser le groupe de clusters pour les marqueurs
  mainClusterGroup = L.markerClusterGroup({
    disableClusteringAtZoom: 13,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    maxClusterRadius: 50
  });
  
  map.addLayer(mainClusterGroup);
  
  // Ajouter l'indicateur de chargement si nécessaire
  createLoadingIndicator();
}

// Créer l'indicateur de chargement s'il n'existe pas déjà
function createLoadingIndicator() {
  if (!document.getElementById('loading-indicator')) {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-indicator';
    loadingDiv.style.position = 'absolute';
    loadingDiv.style.top = '50%';
    loadingDiv.style.left = '50%';
    loadingDiv.style.transform = 'translate(-50%, -50%)';
    loadingDiv.style.background = 'rgba(255, 255, 255, 0.8)';
    loadingDiv.style.padding = '10px 20px';
    loadingDiv.style.borderRadius = '5px';
    loadingDiv.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
    loadingDiv.style.zIndex = '1000';
    loadingDiv.style.display = 'none';
    loadingDiv.textContent = 'Loading data...';
    document.body.appendChild(loadingDiv);
  }
}

// Fonction pour afficher/cacher l'indicateur de chargement
window.showLoading = function(show) {
  const loadingElement = document.getElementById('loading-indicator');
  if (loadingElement) {
    loadingElement.style.display = show ? 'block' : 'none';
  }
};

// Initialisation au chargement de la page - nous n'appelons pas directement chargerEtAfficherDonnees ici
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM chargé, initialisation...");
  initMap();
  
  // Attendre un peu pour s'assurer que tous les scripts sont chargés
  setTimeout(() => {
    console.log("Tentative de chargement des données...");
    // Vérifier si la fonction est disponible
    if (typeof window.chargerEtAfficherDonnees === 'function') {
      window.chargerEtAfficherDonnees();
    } else {
      console.error("La fonction chargerEtAfficherDonnees n'est pas définie !");
      alert("Erreur: impossible de charger les données (chargerEtAfficherDonnees non définie)");
    }
  }, 100);
});