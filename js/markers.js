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
    
    let popupContent = `
      <div style="font-family: Arial, sans-serif; font-size: 13px;">
        <h4 style="margin: 0 0 8px 0;">${point.id || 'Barrier'}</h4>
        <div><strong>Type:</strong> ${markerType || 'N/A'}</div>
    `;
    
    if (point.source) {
      popupContent += `<div><strong>Height Class:</strong> ${point.source}</div>`;
    }
    
    if (point.owner) {
      popupContent += `<div><strong>ZHYD Code:</strong> ${point.owner}</div>`;
    }
    
    if (point.rivername) {
      popupContent += `<div><strong>River:</strong> ${point.rivername}</div>`;
    }
    
    if (point.basinname) {
      popupContent += `<div><strong>Basin:</strong> ${point.basinname}</div>`;
    }
    
    if (point.height) {
      popupContent += `<div><strong>Height:</strong> ${point.height}</div>`;
    }
    
    if (point.country) {
      popupContent += `<div><strong>Country:</strong> ${point.country}</div>`;
    }
    
    popupContent += `</div>`;
    
    const marker = L.marker([point.latitude, point.longitude], {
      icon: customIcon,
      alt: markerType
    }).bindPopup(popupContent);
    
    mainClusterGroup.addLayer(marker);
  });
  
  map.addLayer(mainClusterGroup);
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