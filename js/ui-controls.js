// Fonctions pour la gestion des contrôles UI
document.addEventListener('DOMContentLoaded', function() {
  // Boutons pour afficher/masquer les panneaux
  document.getElementById('show-filter').addEventListener('click', function() {
    document.getElementById('filter-panel').style.display = 'block';
    document.getElementById('tracker-panel').style.display = 'none';
    document.getElementById('download-form').style.display = 'none';
  });
  
  document.getElementById('show-tracker-filter').addEventListener('click', function() {
    document.getElementById('filter-panel').style.display = 'none';
    document.getElementById('tracker-panel').style.display = 'block';
    document.getElementById('download-form').style.display = 'none';
  });
  
  document.getElementById('show-download').addEventListener('click', function() {
    document.getElementById('filter-panel').style.display = 'none';
    document.getElementById('tracker-panel').style.display = 'none';
    document.getElementById('download-form').style.display = 'block';
  });
  
  // Appliquer les filtres
  document.getElementById('apply-filters').addEventListener('click', function() {
    // Récupérer les types sélectionnés
    const typeCheckboxes = document.querySelectorAll('#barrier-type-filters input:checked');
    activeFilters.types = Array.from(typeCheckboxes).map(cb => cb.value);
    
    // Récupérer la source sélectionnée
    activeFilters.source = document.getElementById('data-source-filter').value;
    
    // Récupérer la valeur de densité
    activeFilters.density = parseInt(document.getElementById('density-filter').value);
    
    // Afficher les points filtrés
    displayFilteredPoints();
  });
  
  // Réinitialiser les filtres
  document.getElementById('reset-filters').addEventListener('click', function() {
    // Décocher toutes les cases
    document.querySelectorAll('#barrier-type-filters input').forEach(cb => {
      cb.checked = false;
    });
    
    // Réinitialiser les autres filtres
    document.getElementById('data-source-filter').value = '';
    document.getElementById('density-filter').value = 0;
    document.getElementById('density-value').textContent = '0';
    
    // Réinitialiser les filtres actifs
    activeFilters = {
      types: [],
      source: '',
      density: 0,
      user: ''
    };
    
    // Afficher tous les points
    displayFilteredPoints();
  });
  
  // Fermer le panneau de filtres
  document.getElementById('close-filters').addEventListener('click', function() {
    document.getElementById('filter-panel').style.display = 'none';
  });
  
  // Appliquer le filtre utilisateur
  document.getElementById('apply-user-filter').addEventListener('click', function() {
    // Vérifier d'abord l'entrée manuelle, puis la liste déroulante si l'entrée est vide
    let selectedZHYD = document.getElementById('user-filter-input').value.trim();
    
    // Si l'entrée manuelle est vide, utiliser la valeur de la liste déroulante
    if (!selectedZHYD) {
      selectedZHYD = document.getElementById('user-filter-select').value;
    }
    
    // Appliquer le filtre
    activeFilters.user = selectedZHYD;
    displayFilteredPoints();
  });
  
  // Synchronisation entre la liste déroulante et le champ de saisie
  document.getElementById('user-filter-select').addEventListener('change', function() {
    // Si l'utilisateur sélectionne un code dans la liste, effacer le champ de saisie manuelle
    if (this.value) {
      document.getElementById('user-filter-input').value = '';
    }
  });
  
  // Fermer le panneau de filtrage par ZHYD
  document.getElementById('close-tracker-filter').addEventListener('click', function() {
    document.getElementById('tracker-panel').style.display = 'none';
  });
  
  // Mettre à jour l'affichage de la valeur de densité
  document.getElementById('density-filter').addEventListener('input', function() {
    document.getElementById('density-value').textContent = this.value;
  });
  
  // Gestion du formulaire de téléchargement
  document.getElementById('data-download-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const country = document.getElementById('country').value;
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const organization = document.getElementById('organization').value;
    
    // Simuler le téléchargement des données
    console.log('Téléchargement des données pour:', { 
      email, country, firstName, lastName, organization 
    });
    
    alert('Merci ! Votre téléchargement va commencer sous peu. Vous recevrez également un email avec le lien de téléchargement.');
  });
  
  // Fermer le formulaire de téléchargement
  document.getElementById('abort-download').addEventListener('click', function() {
    document.getElementById('download-form').style.display = 'none';
    document.getElementById('data-download-form').reset();
  });
  
  // Gestion du sélecteur de type de carte dans le panneau de filtres
  document.getElementById('map-type-selector').addEventListener('change', function() {
    updateMapType(this.value);
    
    // Synchroniser avec le sélecteur visible
    document.getElementById('map-type-selector-visible').value = this.value;
  });
  
  // Gestion du sélecteur de type de carte toujours visible
  document.getElementById('map-type-selector-visible').addEventListener('change', function() {
    updateMapType(this.value);
    
    // Synchroniser avec le sélecteur dans le panneau de filtres
    document.getElementById('map-type-selector').value = this.value;
  });
  
  // Fonction pour mettre à jour le type de carte
  function updateMapType(value) {
    if (value === 'street') {
      map.removeLayer(baseMaps.Satellite);
      map.addLayer(baseMaps.Street);
    } else if (value === 'satellite') {
      map.removeLayer(baseMaps.Street);
      map.addLayer(baseMaps.Satellite);
    }
  }
});