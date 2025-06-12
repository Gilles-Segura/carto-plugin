// Configuration globale et initialisation de la carte
const supabaseUrl = 'https://qidnzebmtbxhabtsprkx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpZG56ZWJtdGJ4aGFidHNwcmt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NDQ3ODEsImV4cCI6MjA2NDQyMDc4MX0.IKCuSbFN0R3UVT6PBiOIWPly_hAuwgnc38FfmpmWbYM';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Variables globales
let map;
let baseMaps;
let allPoints = [];
let mainClusterGroup;
let activeFilters = {
  types: [],
  source: '',
  density: 0,
  user: ''
};

// Couleurs pour différents types de barrières
const typeColors = {};
const colorList = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'];
let colorIndex = 0;
const iconCache = {};

// Initialisation de la carte
function initMap() {
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

  // Ajout du contrôle de couches en haut à droite de la carte
  L.control.layers(baseMaps, null, {position: 'topright'}).addTo(map);
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
  initMap();
  chargerEtAfficherDonnees();
});