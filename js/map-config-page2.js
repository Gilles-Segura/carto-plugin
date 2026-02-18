// map-config-page2.js - Configuration et initialisation pour page2

let mapPage2;
let mainClusterGroupPage2;
let allPointsPage2 = [];
let activeFiltersPage2 = { types: [], source: '', density: 0, user: '' };

// Info repo CDN (utilisée par data-loader-page2.js)
window.CDN_REPO = 'Gilles-Segura/Gilles-Segura-CARTO-DATA-CDN-BTV1';
window.CDN_BRANCH = 'main';
window.CDN_API_BASE = 'https://api.github.com/repos';

// Formspree endpoint for static hosting (set this to enable Formspree fallback)
window.FORMSPREE_ENDPOINT = 'https://formspree.io/f/mgolzlka';

// Paramètre: zoom au-dessus duquel le clustering est désactivé (un seul niveau de cluster en dessous)
window.PAGE2_CLUSTER_DISABLE_AT_ZOOM = 12;

const typeColorsPage2 = {};
const colorListPage2 = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'];
let colorIndexPage2 = 0;
const iconCachePage2 = {};

function initMapPage2() {
  baseMapsPage2 = {
    "Street": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }),
    "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: '&copy; Esri', maxZoom: 19 })
  };

  mapPage2 = L.map('map', { center: [46.5, 2.5], zoom: 6, layers: [baseMapsPage2.Street] });
  mainClusterGroupPage2 = L.markerClusterGroup({ disableClusteringAtZoom: 13, spiderfyOnMaxZoom: true, showCoverageOnHover: false });
  mapPage2.addLayer(mainClusterGroupPage2);

  L.control.layers(baseMapsPage2, null, { position: 'topright' }).addTo(mapPage2);

  createLoadingIndicatorPage2();
}

function createLoadingIndicatorPage2() {
  if (!document.getElementById('loading-indicator-page2')) {
    const d = document.createElement('div');
    d.id = 'loading-indicator-page2';
    d.style.position = 'absolute'; d.style.top = '10px'; d.style.right = '10px'; d.style.zIndex = '1000';
    d.style.padding = '6px 10px'; d.style.background = 'rgba(255,255,255,0.9)'; d.style.borderRadius = '6px';
    d.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'; d.textContent = 'Ready';
    document.body.appendChild(d);
  }
}

window.updateLoadingPage2 = function(text) {
  const el = document.getElementById('loading-indicator-page2'); if (el) el.textContent = text;
};

document.addEventListener('DOMContentLoaded', function() {
  initMapPage2();
  // petit délai pour que les scripts soient disponibles
  setTimeout(() => {
    if (typeof window.loaderPage2 === 'function') {
      window.loaderPage2();
    } else {
      console.warn('loaderPage2 non défini');
    }
  }, 150);
});
