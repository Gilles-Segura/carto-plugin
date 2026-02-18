// data-loader-page2.js - charge les fichiers .geojson.gz depuis le repo GitHub via l'API

console.log('data-loader-page2 loaded');

// Fonction exposée pour lancer le chargement
window.loaderPage2 = async function() {
  try {
    updateLoadingPage2('Listing files in CDN...');

    const apiUrl = `${window.CDN_API_BASE}/${window.CDN_REPO}/contents/type?ref=${window.CDN_BRANCH}`;
    const listResp = await fetch(apiUrl);
    if (!listResp.ok) throw new Error('Impossible de lister les fichiers CDN: ' + listResp.status);
    const files = await listResp.json();

    // Filtrer les fichiers .geojson.gz
    const geoFiles = files.filter(f => f.name && f.name.toLowerCase().endsWith('.geojson.gz'));
    if (geoFiles.length === 0) {
      console.warn('Aucun fichier .geojson.gz trouvé dans le dossier type du repo');
      updateLoadingPage2('No files found');
      return;
    }

    // Charger chaque fichier
    allPointsPage2 = [];
    const typesFound = [];

    for (const file of geoFiles) {
      updateLoadingPage2(`Loading ${file.name} ...`);
      try {
        const resp = await fetch(file.download_url);
        if (!resp.ok) { console.warn('Fetch failed for', file.download_url); continue; }
        const buf = await resp.arrayBuffer();

        const decompressed = pako.inflate(new Uint8Array(buf), { to: 'string' });
        const geo = JSON.parse(decompressed);

        const fileType = file.name.replace(/\.geojson\.gz$/i, '');
        typesFound.push(fileType);

        if (geo && Array.isArray(geo.features)) {
          for (const feat of geo.features) {
            if (!feat || !feat.geometry || !feat.geometry.coordinates) continue;
            const coords = feat.geometry.coordinates;
            if (!Array.isArray(coords) || coords.length < 2) continue;
            const props = feat.properties || {};
            // privacy: remove potential PII fields
            if (props.user_username) delete props.user_username;
            allPointsPage2.push({
              id: props.id || (`${fileType}-${Math.random().toString(36).slice(2,9)}`),
              type: fileType,
              longitude: coords[0],
              latitude: coords[1],
              source: props.hclass || props.height_class || null,
              owner: props.zhyd || null,
              rivername: props.rivername || props.river || null,
              height: props.height || null,
              basinname: props.basinname || props.basin || null,
              country: props.country || null,
              tableConfig: { name: `type_${fileType}`, type: fileType },
              properties: props, // conserver toutes les propriétés d'origine pour la popup
              source_file_url: file.download_url, // lien vers le fichier .geojson.gz sur GitHub raw
              source_file_name: file.name
            });
          }
        }
      } catch (e) {
        console.error('Erreur lors du chargement du fichier', file.name, e);
      }
    }

    // Uniques
    const uniqueTypes = [...new Set(typesFound.map(t => t))];
    window.PAGE2_BARRIER_TYPES = uniqueTypes;

    updateLoadingPage2(`Processing ${allPointsPage2.length} points...`);

    // Appeler les fonctions de filtre/affichage (implémentées dans markers-page2.js & filters-page2.js)
    if (typeof populateTypeFiltersPage2 === 'function') populateTypeFiltersPage2(uniqueTypes);
    if (typeof populateSourceFiltersPage2 === 'function') populateSourceFiltersPage2([...new Set(allPointsPage2.map(p=>p.source).filter(Boolean))]);
    if (typeof populateUserFiltersPage2 === 'function') populateUserFiltersPage2([...new Set(allPointsPage2.map(p=>p.owner).filter(Boolean))]);

    if (typeof displayFilteredPointsPage2 === 'function') displayFilteredPointsPage2();

    updateLoadingPage2('Done');
  } catch (error) {
    console.error('loaderPage2 error', error);
    updateLoadingPage2('Error');
  }
};
