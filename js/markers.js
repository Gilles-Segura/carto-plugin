// Fonctions pour la création et la gestion des marqueurs

// Création d'une icône personnalisée en forme de diamant selon le type
function createCustomIcon(type) {
  if (!type) type = 'default';
  
  // Si on a déjà créé une icône pour ce type, la réutiliser
  if (iconCache[type]) return iconCache[type];

  // Assigner une couleur au type s'il n'en a pas déjà une
  if (!typeColors[type]) {
    typeColors[type] = colorList[colorIndex % colorList.length];
    colorIndex++;
  }
  
  // Créer un élément SVG pour l'icône en forme de diamant
  const svgTemplate = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <polygon points="12,2 22,12 12,22 2,12" fill="${typeColors[type]}" stroke="white" stroke-width="2"/>
    </svg>
  `;
  
  // Encoder correctement en Base64 pour l'URL data
  const svgBase64 = btoa(unescape(encodeURIComponent(svgTemplate)));
  
  // Créer l'icône
  iconCache[type] = L.icon({
    iconUrl: 'data:image/svg+xml;base64,' + svgBase64,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
  
  return iconCache[type];
}

// Création d'une icône pour les clusters
function createClusterIcon(cluster) {
  const childCount = cluster.getChildCount();
  let size, className;
  
  if (childCount < 10) {
    size = 'small';
    className = 'marker-cluster marker-cluster-small';
  } else if (childCount < 100) {
    size = 'medium';
    className = 'marker-cluster marker-cluster-medium';
  } else {
    size = 'large';
    className = 'marker-cluster marker-cluster-large';
  }
  
  return L.divIcon({
    html: `<div><span>${childCount}</span></div>`,
    className: className,
    iconSize: L.point(40, 40)
  });
}

// Affichage des points filtrés sur la carte
function displayFilteredPoints() {
  // Supprimer les marqueurs existants
  if (mainClusterGroup) {
    map.removeLayer(mainClusterGroup);
  }
  
  // Créer un nouveau groupe de clusters
  mainClusterGroup = L.markerClusterGroup({
    maxClusterRadius: function(zoom) {
      return zoom <= 4 ? 80 : 60;
    },
    iconCreateFunction: createClusterIcon,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true
  });
  
  // Filtrer les points selon les filtres actifs
  const filteredPoints = allPoints.filter(point => {
    const pointType = point.type || point.tableConfig.type;
    
    // Filtre par type
    if (activeFilters.types.length > 0 && !activeFilters.types.includes(pointType)) {
      return false;
    }
    
    // Filtre par source (maintenant hclass)
    if (activeFilters.source && point.source !== activeFilters.source) {
      return false;
    }
    
    // Filtre par utilisateur (maintenant zhyd)
    if (activeFilters.user && point.owner !== activeFilters.user) {
      return false;
    }
    
    // Filtre par densité (simulation)
    if (activeFilters.density > 0) {
      const randomValue = Math.random() * 10;
      if (randomValue < activeFilters.density) {
        return false;
      }
    }
    
    return true;
  });
  
  console.log(`Affichage de ${filteredPoints.length} points après filtrage`);
  
  // Ajouter les marqueurs au groupe de clusters
  filteredPoints.forEach(point => {
    const markerType = point.type || point.tableConfig.type;
    const customIcon = createCustomIcon(markerType);
    
    // Popup avec style amélioré et contenu plus complet
    let popupContent = `
      <div class="barrier-popup">
        <h3>${point.id || 'Barrier'}</h3>
        <table class="barrier-details">
          <tr>
            <td><strong>Type:</strong></td>
            <td>${markerType || 'N/A'}</td>
          </tr>
    `;
    
    // Ajouter toutes les propriétés disponibles
    if (point.source) {
      popupContent += `
        <tr>
          <td><strong>Height Class:</strong></td>
          <td>${point.source}</td>
        </tr>
      `;
    }
    
    if (point.owner) {
      popupContent += `
        <tr>
          <td><strong>ZHYD Code:</strong></td>
          <td>${point.owner}</td>
        </tr>
      `;
    }
    
    if (point.rivername) {
      popupContent += `
        <tr>
          <td><strong>River:</strong></td>
          <td>${point.rivername}</td>
        </tr>
      `;
    }
    
    if (point.basinname) {
      popupContent += `
        <tr>
          <td><strong>Basin:</strong></td>
          <td>${point.basinname}</td>
        </tr>
      `;
    }
    
    if (point.height) {
      popupContent += `
        <tr>
          <td><strong>Height:</strong></td>
          <td>${point.height} m</td>
        </tr>
      `;
    }
    
    if (point.country) {
      popupContent += `
        <tr>
          <td><strong>Country:</strong></td>
          <td>${point.country}</td>
        </tr>
      `;
    }
    
    // Ajouter les coordonnées
    popupContent += `
        <tr>
          <td><strong>Coordinates:</strong></td>
          <td>${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)}</td>
        </tr>
      </table>
      
      <div class="barrier-actions">
        <button onclick="map.setView([${point.latitude}, ${point.longitude}], 18)">Zoom</button>
      </div>
    </div>
    `;
    
    // Ajouter le style CSS directement dans le HTML
    popupContent += `
      <style>
        .barrier-popup {
          font-family: 'Segoe UI', Roboto, Arial, sans-serif;
          padding: 5px;
          max-width: 300px;
        }
        .barrier-popup h3 {
          margin: 0 0 10px 0;
          padding-bottom: 5px;
          border-bottom: 1px solid #ddd;
          font-size: 16px;
          color: #333;
        }
        .barrier-details {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 12px;
        }
        .barrier-details td {
          padding: 3px;
          font-size: 13px;
        }
        .barrier-details tr:nth-child(even) {
          background-color: #f5f5f5;
        }
        .barrier-actions {
          text-align: center;
        }
        .barrier-actions button {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        .barrier-actions button:hover {
          background-color: #45a049;
        }
      </style>
    `;
    
    const marker = L.marker([point.latitude, point.longitude], {
      icon: customIcon,
      alt: markerType
    }).bindPopup(popupContent);
    
    mainClusterGroup.addLayer(marker);
  });
  
  map.addLayer(mainClusterGroup);
  
  // Si le loader est encore visible, le masquer maintenant
  if (window.loadingOverlayInstance) {
    window.loadingOverlayInstance.hide();
    window.loadingOverlayInstance = null;
  }
}

// Création d'une légende pour la carte avec des marqueurs en forme de diamant
function createLegend() {
  // Supprimer la légende existante si elle existe
  const existingLegend = document.querySelector('.legend');
  if (existingLegend) {
    existingLegend.remove();
  }
  
  const legend = L.control({ position: 'bottomright' });
  
  legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'legend');
    div.innerHTML = '<h4>Barrier types</h4>';
    
    // Ajouter un élément de légende pour chaque type avec forme en diamant
    Object.entries(typeColors).forEach(([type, color]) => {
      div.innerHTML += `
        <div class="legend-item">
          <svg width="16" height="16" viewBox="0 0 16 16" style="display: inline-block; vertical-align: middle; margin-right: 5px;">
            <polygon points="8,1 15,8 8,15 1,8" fill="${color}" stroke="black" stroke-width="1"/>
          </svg>
          ${type}
        </div>`;
    });
    
    return div;
  };
  
  legend.addTo(map);
}