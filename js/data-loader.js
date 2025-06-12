// Fonctions pour charger les données depuis Supabase ou le cache local
async function chargerEtAfficherDonnees() {
  try {
    // Vérifier si les données sont en cache et si elles sont récentes
    const cachedData = localStorage.getItem('cartographyData');
    const cacheTimestamp = localStorage.getItem('cartographyDataTimestamp');
    const cacheExpiration = 24 * 60 * 60 * 1000; // 24 heures en millisecondes
    
    if (cachedData && cacheTimestamp) {
      const now = new Date().getTime();
      if (now - parseInt(cacheTimestamp) < cacheExpiration) {
        console.log('Chargement des données depuis le cache local');
        allPoints = JSON.parse(cachedData);
        initialiserFiltresEtAffichage();
        return;
      }
    }
    
    // Si pas de cache ou cache expiré, charger depuis Supabase
    console.log('Chargement des données depuis Supabase');
    
    const { data: tablesInfo, error: errorTables } = await supabaseClient
      .from('typeatlas')
      .select('table_name, table_type');

    if (errorTables) {
      throw new Error('Erreur lors de la récupération des tables');
    }

    // Filtrer les tables valides
    const tableConfigs = tablesInfo
      .filter(info => info.table_name && info.table_name.trim() !== '' && info.table_name !== 'atlas2020')
      .map(info => ({
        name: info.table_name,
        type: info.table_type || 'unknown'
      }));

    console.log(`${tableConfigs.length} tables trouvées à traiter`);
    allPoints = [];

    for (const tableConfig of tableConfigs) {
      try {
        const { data: points, error: errorPoints } = await supabaseClient
          .from(tableConfig.name)
          .select('id, type, longitude, latitude, hclass, zhyd, rivername, height, basinname, country');

        if (errorPoints) {
          console.error(`Erreur avec ${tableConfig.name}:`, errorPoints);
          continue;
        }

        if (points && points.length > 0) {
          // Collecter tous les points valides
          points.forEach(point => {
            if (typeof point.latitude === 'number' && typeof point.longitude === 'number') {
              allPoints.push({
                ...point,
                source: point.hclass,
                owner: point.zhyd,
                tableConfig
              });
            } else {
              console.warn(`Données de localisation invalides pour un point de la table ${tableConfig.name}:`, point);
            }
          });
          console.log(`${points.length} points chargés pour ${tableConfig.name}`);
        } else {
          console.log(`Aucun point trouvé pour la table ${tableConfig.name}`);
        }
      } catch (tableError) {
        console.error(`Erreur traitement ${tableConfig.name}:`, tableError);
      }
    }

    if (allPoints.length === 0) {
      console.warn("Aucun point chargé, génération de données test");
      genererDonneesTest();
      return;
    }
    
    console.log(`Total points chargés: ${allPoints.length}`);
    
    // Mettre en cache les données
    localStorage.setItem('cartographyData', JSON.stringify(allPoints));
    localStorage.setItem('cartographyDataTimestamp', new Date().getTime().toString());
    
    initialiserFiltresEtAffichage();
    
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    
    // Essayer d'utiliser le cache même expiré en cas d'erreur
    const cachedData = localStorage.getItem('cartographyData');
    if (cachedData) {
      console.log('Utilisation du cache après erreur');
      allPoints = JSON.parse(cachedData);
      initialiserFiltresEtAffichage();
    } else {
      genererDonneesTest();
    }
  }
}

// Fonction pour initialiser les filtres et afficher les points
function initialiserFiltresEtAffichage() {
  // Créer la liste des types uniques pour le filtre
  const uniqueTypes = [...new Set(allPoints.map(point => point.type || point.tableConfig.type))];
  populateTypeFilters(uniqueTypes);
  
  // Créer la liste des sources de données uniques
  const uniqueSources = [...new Set(allPoints.filter(p => p.source).map(p => p.source))];
  populateSourceFilters(uniqueSources);
  
  // Créer la liste des codes ZHYD uniques
  const uniqueUsers = [...new Set(allPoints.filter(p => p.owner).map(p => p.owner))];
  populateUserFilters(uniqueUsers);
  
  // Afficher tous les points
  displayFilteredPoints();
  
  // Créer la légende
  createLegend();
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