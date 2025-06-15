// data-loader.js - Chargeur de données GeoJSON compressées depuis GitHub Pages

// Afficher un message de débogage pour s'assurer que le fichier est chargé
console.log("Version data-loader CDN chargée");

// Fonction pour créer un overlay de chargement
function createLoadingOverlay() {
  // Supprimer l'ancien overlay s'il existe
  const oldOverlay = document.getElementById('loading-overlay');
  if (oldOverlay) {
    oldOverlay.remove();
  }
  
  // Créer un nouvel overlay avec un style moderne
  const overlay = document.createElement('div');
  overlay.id = 'loading-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'; // Fond légèrement plus transparent
  overlay.style.backdropFilter = 'blur(5px)'; // Effet de flou moderne
  overlay.style.zIndex = '9999';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.transition = 'all 0.3s ease';
  
  // Conteneur du message avec design moderne
  const messageBox = document.createElement('div');
  messageBox.id = 'loading-message';
  messageBox.style.backgroundColor = 'white';
  messageBox.style.color = '#333';
  messageBox.style.padding = '25px 30px';
  messageBox.style.borderRadius = '12px';
  messageBox.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
  messageBox.style.maxWidth = '450px';
  messageBox.style.width = '85%';
  messageBox.style.textAlign = 'center';
  messageBox.style.transform = 'translateY(0)';
  messageBox.style.animation = 'loadingFadeIn 0.3s ease-out';
  messageBox.style.fontFamily = "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif";
  
  // Ajouter une animation CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes loadingFadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    @keyframes progressAnimation {
      from { background-position: 0 0; }
      to { background-position: 50px 0; }
    }
  `;
  document.head.appendChild(style);
  
  // Titre plus moderne
  const title = document.createElement('h2');
  title.textContent = 'Loading in progress...';
  title.style.margin = '0 0 15px 0';
  title.style.fontSize = '24px';
  title.style.fontWeight = '500';
  title.style.color = '#2d3748';
  
  // Message de statut avec meilleur style
  const statusMsg = document.createElement('p');
  statusMsg.id = 'loading-status';
  statusMsg.textContent = 'Initializing...';
  statusMsg.style.margin = '0 0 20px 0';
  statusMsg.style.color = '#4a5568';
  statusMsg.style.fontSize = '16px';
  
  // Compteur stylisé
  const counter = document.createElement('p');
  counter.id = 'loading-counter';
  counter.textContent = 'Points loaded: 0';
  counter.style.fontSize = '14px';
  counter.style.color = '#718096';
  counter.style.margin = '0 0 20px 0';
  
  // Container de la barre de progression moderne
  const progressContainer = document.createElement('div');
  progressContainer.style.width = '100%';
  progressContainer.style.height = '8px';
  progressContainer.style.backgroundColor = '#e2e8f0';
  progressContainer.style.borderRadius = '4px';
  progressContainer.style.overflow = 'hidden';
  progressContainer.style.marginBottom = '5px';
  
  // Barre de progression améliorée
  const progressBar = document.createElement('div');
  progressBar.id = 'loading-progress';
  progressBar.style.width = '0%';
  progressBar.style.height = '100%';
  progressBar.style.borderRadius = '4px';
  progressBar.style.transition = 'width 0.4s ease-in-out';
  // Gradient moderne pour la barre de progression
  progressBar.style.background = 'linear-gradient(45deg, #38b2ac 0%, #4299e1 100%)';
  // Effet de motif animé
  progressBar.style.backgroundSize = '50px 50px';
  progressBar.style.backgroundImage = 'linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent)';
  progressBar.style.animation = 'progressAnimation 2s linear infinite';
  
  // Assembler tous les éléments
  progressContainer.appendChild(progressBar);
  messageBox.appendChild(title);
  messageBox.appendChild(statusMsg);
  messageBox.appendChild(counter);
  messageBox.appendChild(progressContainer);
  overlay.appendChild(messageBox);
  
  // Ajouter au body
  document.body.appendChild(overlay);
  
  return {
    updateStatus: function(message) {
      const statusElement = document.getElementById('loading-status');
      if (statusElement) {
        statusElement.textContent = message;
        // Animation subtile lors de la mise à jour
        statusElement.style.animation = 'pulse 0.3s ease-in-out';
        setTimeout(() => {
          statusElement.style.animation = '';
        }, 300);
      }
    },
    updateProgress: function(progress) {
      const progressElement = document.getElementById('loading-progress');
      if (progressElement) {
        progressElement.style.width = `${progress}%`;
      }
    },
    updateCounter: function(count) {
      const counterElement = document.getElementById('loading-counter');
      if (counterElement) {
        counterElement.textContent = `Points loaded: ${count.toLocaleString()}`;
      }
    },
    hide: function() {
      const overlay = document.getElementById('loading-overlay');
      if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
          if (overlay.parentNode) {
            overlay.remove();
          }
        }, 300);
      }
    }
  };
}

// Fonction principale pour charger et afficher les données
window.chargerEtAfficherDonnees = async function() {
  console.log("DÉBUT chargerEtAfficherDonnees");
  try {
    // Créer l'overlay de chargement
    const loader = createLoadingOverlay();
    
    console.log('Chargement des données depuis le CDN');
    allPoints = [];
    let totalPointsLoaded = 0;
    
    const totalTypes = window.BARRIER_TYPES.length;
    
    // Charger les données pour chaque type de barrière
    for (let i = 0; i < totalTypes; i++) {
      const type = window.BARRIER_TYPES[i];
      const progress = Math.round((i / totalTypes) * 80); // 80% max pour le chargement
      
      loader.updateStatus(`Loading ${type.toUpperCase()} barriers... (${i+1}/${totalTypes})`);
      loader.updateProgress(progress);
      
      try {
        console.log(`Chargement des données pour le type: ${type}`);
        const points = await chargerDonneesParType(type);
        
        if (points && points.length > 0) {
          // Collecter tous les points valides
          allPoints = [...allPoints, ...points];
          totalPointsLoaded += points.length;
          
          console.log(`${points.length} points chargés pour le type ${type}`);
          loader.updateStatus(`Loaded ${points.length.toLocaleString()} ${type.toUpperCase()} barriers... (${i+1}/${totalTypes})`);
          loader.updateCounter(totalPointsLoaded);
        } else {
          console.log(`Aucun point trouvé pour le type ${type}`);
        }
      } catch (typeError) {
        console.error(`Erreur chargement ${type}:`, typeError);
        loader.updateStatus(`Error loading ${type.toUpperCase()}... Continuing with other types.`);
      }
      
if (i == totalTypes-1 ) {
      loader.updateStatus(`Clustering ${totalPointsLoaded.toLocaleString()} points...`);
    loader.updateProgress(95);
}
      // Petite pause pour permettre à l'UI de se mettre à jour
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    



    if (allPoints.length === 0) {
      console.warn("Aucun point chargé, génération de données test");
      genererDonneesTest();
      loader.hide();
      return;
    }
    
    console.log(`Total points chargés: ${allPoints.length}`);
    
    // Mettre à jour le statut pour l'étape suivante
    loader.updateStatus(`Processing ${totalPointsLoaded.toLocaleString()} points...`);
    loader.updateProgress(85);
    
    // Initialiser les filtres - cette étape peut également prendre du temps
    console.log("Initialisation des filtres");
    const uniqueTypes = [...new Set(allPoints.map(point => point.type || point.tableConfig.type))];
    populateTypeFilters(uniqueTypes);
    
    const uniqueSources = [...new Set(allPoints.filter(p => p.source).map(p => p.source))];
    populateSourceFilters(uniqueSources);
    
    const uniqueUsers = [...new Set(allPoints.filter(p => p.owner).map(p => p.owner))];
    populateUserFilters(uniqueUsers);
    
    // Mise à jour du statut pour indiquer clairement le clustering
    loader.updateStatus(`Clustering ${totalPointsLoaded.toLocaleString()} points...`);
    loader.updateProgress(95);
    
    // Afficher tous les points - cette étape prend du temps pour le clustering
    displayFilteredPoints();
    
    // Créer la légende
    createLegend();
    
    // Masquer l'indicateur de chargement une fois que tout est terminé
    loader.hide();
    
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    
    const loader = document.getElementById('loading-overlay');
    if (loader) {
      if (loader) loader.style.display = 'none';
    }
    
    genererDonneesTest();
  }
};

// Fonction pour charger les données d'un type de barrière spécifique depuis le CDN
async function chargerDonneesParType(type) {
  console.log("DÉBUT chargerDonneesParType pour", type);
  try {
    // URL du fichier GeoJSON compressé pour ce type
    const url = `${window.CDN_BASE_URL}/types/tb${type.toLowerCase()}.geojson.gz`;
    console.log(`URL correcte: ${url}`);
    
    // Récupérer les données
    console.log(`Fetch en cours pour ${url}...`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} pour le type ${type}`);
    }
    
    console.log(`Données reçues pour ${type}, décompression en cours...`);
    // Récupération des données compressées
    const compressedData = await response.arrayBuffer();
    console.log(`Taille des données compressées: ${compressedData.byteLength} octets`);
    
    // Décompression avec pako
    try {
      console.log("Tentative de décompression...");
      const decompressedData = pako.inflate(new Uint8Array(compressedData), { to: 'string' });
      console.log(`Décompression réussie: ${decompressedData.length} caractères`);
      console.log("Début des données:", decompressedData.substring(0, 30));
      
      // Tentative de parsing JSON
      console.log("Tentative de parsing JSON...");
      const geoJSON = JSON.parse(decompressedData);
      console.log("Parsing JSON réussi");
      
      // Vérifier la structure des données
      if (!geoJSON.features || !Array.isArray(geoJSON.features)) {
        console.warn(`Structure GeoJSON invalide pour le type ${type}`);
        return [];
      }
      
      // Convertir les caractéristiques GeoJSON en format de point compatible
      const points = geoJSON.features
        .filter(feature => 
          feature && feature.geometry && 
          feature.geometry.coordinates && 
          Array.isArray(feature.geometry.coordinates) &&
          feature.geometry.coordinates.length >= 2
        )
        .map(feature => {
          // Extraire les coordonnées et propriétés
          const coords = feature.geometry.coordinates;
          const props = feature.properties || {};
          
          return {
            id: props.id || `${type}-${Math.random().toString(36).substr(2, 9)}`,
            type: type,
            longitude: coords[0],
            latitude: coords[1],
            source: props.hclass || props.height_class,
            owner: props.zhyd,
            rivername: props.rivername || props.river,
            height: props.height,
            basinname: props.basinname || props.basin,
            country: props.country,
            tableConfig: {
              name: `type_${type}`,
              type: type
            }
          };
        }).filter(point => 
          // Filtrer les points qui ont des coordonnées valides
          typeof point.latitude === 'number' && 
          typeof point.longitude === 'number' &&
          !isNaN(point.latitude) &&
          !isNaN(point.longitude)
        );
      
      console.log(`Conversion terminée pour ${type}, ${points.length} points valides sur ${geoJSON.features.length} features`);
      return points;
      
    } catch (e) {
      console.error(`Erreur lors de la décompression/parsing pour ${type}:`, e);
      
      // Diagnostic supplémentaire pour les erreurs de syntaxe JSON
      if (e instanceof SyntaxError) {
        try {
          // Essayons d'examiner les données brutes
          const rawData = pako.inflate(new Uint8Array(compressedData), { to: 'string' });
          console.log(`Aperçu des données après décompression (100 premiers caractères): 
            ${JSON.stringify(rawData.substring(0, 100))}`);
        } catch (innerError) {
          console.log("Impossible d'examiner les données brutes:", innerError);
        }
      }
      
      throw e;
    }
    
  } catch (error) {
    console.error(`Erreur lors du chargement des données pour ${type}:`, error);
    return [];
  }
}

// Générer des données de test si aucune donnée n'est chargée
function genererDonneesTest() {
  console.log("Génération de données de test");
  allPoints = [];
  
  const types = ['dam', 'weir', 'sluice', 'ford', 'culvert', 'other', 'ramp'];
  const sources = ['Low', 'Medium', 'High'];
  const owners = ['12345', '23456', '34567', '45678'];
  
  // Générer 500 points aléatoires en France
  for (let i = 0; i < 500; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const owner = owners[Math.floor(Math.random() * owners.length)];
    
    // Coordonnées aléatoires en France
    const latitude = 43.5 + Math.random() * 5.5;
    const longitude = 0.5 + Math.random() * 7.5;
    
    allPoints.push({
      id: `test-${i}`,
      type: type,
      latitude: latitude,
      longitude: longitude,
      source: source,
      owner: owner,
      rivername: `River ${i % 10}`,
      height: Math.round(Math.random() * 30 * 10) / 10,
      tableConfig: { 
        name: 'test_data',
        type: type
      }
    });
  }
  
  initialiserFiltresEtAffichage();
}

// Fonction de test pour vérifier l'accès aux fichiers et la décompression
window.testFileDecompression = async function(type) {
  try {
    const url = `https://gilles-segura.github.io/CARTO-DATA-CDN/script/data/types/tb${type}.geojson.gz`;
    console.log(`Test d'accès à: ${url}`);
    
    // Tentative d'accès avec fetch
    const response = await fetch(url);
    
    if (response.ok) {
      console.log(`✓ Accès réussi (${response.status}): Le fichier est accessible`);
      
      // Essayer de lire les données
      const data = await response.arrayBuffer();
      console.log(`✓ Données reçues: ${data.byteLength} octets`);
      
      // Si pako est disponible, tester la décompression
      if (window.pako) {
        try {
          const decompressedData = pako.inflate(new Uint8Array(data), { to: 'string' });
          console.log(`✓ Décompression réussie: ${decompressedData.length} caractères`);
          console.log("Aperçu des données:", decompressedData.substring(0, 100) + "...");
          
          // Tester le parsing JSON
          try {
            const parsed = JSON.parse(decompressedData);
            console.log("✓ Parsing JSON réussi:", parsed);
            return true;
          } catch (parseError) {
            console.error("✗ Erreur de parsing JSON:", parseError);
            return false;
          }
        } catch (e) {
          console.error("✗ Erreur lors de la décompression:", e);
          return false;
        }
      } else {
        console.warn("⚠ La bibliothèque pako n'est pas disponible pour tester la décompression");
        return false;
      }
    } else {
      console.error(`✗ Échec d'accès (${response.status}): ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error("✗ Erreur lors du test:", error);
    return false;
  }
};


