// Fonctions pour la gestion des filtres

// Remplissage des filtres de type avec les données disponibles
function populateTypeFilters(types) {
  const container = document.getElementById('barrier-type-filters');
  container.innerHTML = '';
  
  types.forEach(type => {
    const div = document.createElement('div');
    div.className = 'filter-option';
    div.style.display = 'flex'; // Ajout du style flex
    div.style.alignItems = 'center'; // Centrer verticalement
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `type-${type}`;
    checkbox.value = type;
    checkbox.style.marginRight = '8px'; // Espace entre la case et le diamant
    
    const checkboxContainer = document.createElement('div');
    checkboxContainer.className = 'checkbox-container';
    checkboxContainer.style.display = 'flex'; // Ajout du style flex
    checkboxContainer.style.alignItems = 'center'; // Centrer verticalement
    
    // S'assurer que le type a bien une couleur assignée
    if (!typeColors[type]) {
      typeColors[type] = colorList[colorIndex % colorList.length];
      colorIndex++;
    }
    
    // Créer le SVG en forme de diamant avec la couleur correcte
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('width', '16');
    svgElement.setAttribute('height', '16');
    svgElement.setAttribute('viewBox', '0 0 16 16');
    svgElement.style.display = 'inline-block';
    svgElement.style.verticalAlign = 'middle';
    svgElement.style.marginRight = '8px';
    
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '8,1 15,8 8,15 1,8');
    polygon.setAttribute('fill', typeColors[type]);
    polygon.setAttribute('stroke', 'black');
    polygon.setAttribute('stroke-width', '1');
    
    svgElement.appendChild(polygon);
    
    const label = document.createElement('label');
    label.htmlFor = `type-${type}`;
    label.textContent = type;
    
    div.appendChild(checkbox); // La case à cocher directement dans le div parent
    checkboxContainer.appendChild(svgElement);
    checkboxContainer.appendChild(label);
    div.appendChild(checkboxContainer);
    
    container.appendChild(div);
  });
}

// Remplissage des filtres de source avec les données disponibles
function populateSourceFilters(sources) {
  const sourceSelect = document.getElementById('data-source-filter');
  sourceSelect.innerHTML = '<option value="">All height classes</option>';
  
  sources.forEach(source => {
    const option = document.createElement('option');
    option.value = source;
    option.textContent = source;
    sourceSelect.appendChild(option);
  });
}

// Remplissage des filtres d'utilisateurs (ZHYD codes)
function populateUserFilters(users) {
  const userSelect = document.getElementById('user-filter-select');
  userSelect.innerHTML = '<option value="">All ZHYD codes</option>';
  
  // Trier les codes ZHYD pour une meilleure lisibilité
  users.sort();
  
  users.forEach(user => {
    if (user) { // Vérifier que le code n'est pas vide
      const option = document.createElement('option');
      option.value = user;
      option.textContent = user;
      userSelect.appendChild(option);
    }
  });
  
  console.log(`${users.length} codes ZHYD uniques disponibles`);
}