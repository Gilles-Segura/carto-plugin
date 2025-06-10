/**
 * Système de gestion des types de marqueurs
 * - Supertype: détermine la couleur du marqueur
 * - Maintype: détermine la forme du marqueur
 */

// Configuration des supertypes (couleurs)
const superTypes = {
    'interet': {
        color: 'blue',
        cssClass: 'blue-marker',
        displayName: "Point d'intérêt"
    },
    'lieu': {
        color: 'green',
        cssClass: 'green-marker',
        displayName: "Lieu"
    },
    'danger': {
        color: 'red',
        cssClass: 'red-marker',
        displayName: "Zone de danger"
    }
    // Ajoutez facilement d'autres supertypes ici
};

// Configuration des maintypes (formes)
const mainTypes = {
    'standard': {
        shape: 'round',
        cssClass: 'round',
        displayName: "Standard"
    },
    'batiment': {
        shape: 'square',
        cssClass: 'square',
        displayName: "Bâtiment"
    },
    'monument': {
        shape: 'triangle',
        cssClass: 'triangle',
        displayName: "Monument"
    }
    // Ajoutez facilement d'autres formes ici
};

// Associations entre types et hiérarchie
const typeHierarchy = {
    'point d\'intérêt': { superType: 'interet', mainType: 'standard' },
    'lieu': { superType: 'lieu', mainType: 'standard' },
    'danger': { superType: 'danger', mainType: 'standard' },
    'musée': { superType: 'interet', mainType: 'monument' },
    'mairie': { superType: 'lieu', mainType: 'batiment' },
    'hôpital': { superType: 'lieu', mainType: 'batiment' }
    // Ajoutez facilement d'autres types ici
};

/**
 * Obtient l'icône Leaflet pour un type donné
 * @param {string} type - Le type du point
 * @returns {L.DivIcon} - L'icône Leaflet configurée
 */
function getIconForType(type) {
    // Récupérer la hiérarchie de types
    const hierarchy = typeHierarchy[type] || { superType: 'interet', mainType: 'standard' };
    
    // Récupérer les classes CSS correspondantes
    const colorClass = superTypes[hierarchy.superType]?.cssClass || 'blue-marker';
    const shapeClass = mainTypes[hierarchy.mainType]?.cssClass || 'round';
    
    // Créer et retourner l'icône
    return L.divIcon({
        className: `custom-marker ${shapeClass} ${colorClass}`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    });
}

/**
 * Récupère la liste des types disponibles
 * @returns {Array} - Liste des types avec leur nom d'affichage
 */
function getAvailableTypes() {
    return Object.keys(typeHierarchy).map(type => ({
        value: type,
        displayName: type.charAt(0).toUpperCase() + type.slice(1)
    }));
}

/**
 * Récupère un supertype à partir d'un type
 * @param {string} type - Le type du point
 * @returns {string} - Le supertype
 */
function getSuperTypeForType(type) {
    return typeHierarchy[type]?.superType || 'interet';
}

/**
 * Récupère un maintype à partir d'un type
 * @param {string} type - Le type du point
 * @returns {string} - Le maintype
 */
function getMainTypeForType(type) {
    return typeHierarchy[type]?.mainType || 'standard';
}

// Exporter les fonctions et constantes
window.markerTypes = {
    getIconForType,
    getAvailableTypes,
    getSuperTypeForType,
    getMainTypeForType,
    superTypes,
    mainTypes,
    typeHierarchy
};