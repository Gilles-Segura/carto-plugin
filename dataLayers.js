/**
 * Gestion des couches de données pour les structures fluviales
 */

// Configuration des structures fluviales
const riverStructureTypes = {
    'barrage': { superType: 'danger', mainType: 'standard', displayName: 'Barrage' },
    'pont': { superType: 'lieu', mainType: 'standard', displayName: 'Pont' },
    'digue': { superType: 'danger', mainType: 'standard', displayName: 'Digue' },
    'ecluse': { superType: 'lieu', mainType: 'batiment', displayName: 'Écluse' },
    'seuil': { superType: 'danger', mainType: 'standard', displayName: 'Seuil' }
};

// Intégrer les types de structures dans le système existant
Object.assign(window.markerTypes.typeHierarchy, riverStructureTypes);

class RiverStructureLayer {
    constructor(map) {
        this.map = map;
        this.markers = [];
        this.layerGroup = L.layerGroup().addTo(map);
    }

    async loadStructures() {
        try {
            const response = await fetch('/api/river-structures');
            const structures = await response.json();
            this.displayStructures(structures);
        } catch (error) {
            console.error('Erreur lors du chargement des structures:', error);
        }
    }

    displayStructures(structures) {
        this.clearMarkers();
        
        structures.forEach(structure => {
            const icon = window.markerTypes.getIconForType(structure.type);
            const marker = L.marker([structure.lat, structure.lng], { 
                icon,
                structureType: structure.type 
            })
                .bindPopup(this.createPopupContent(structure));
            
            this.layerGroup.addLayer(marker);
            this.markers.push(marker);
        });
    }

    createPopupContent(structure) {
        return `
            <div class="structure-popup">
                <h3>${structure.name}</h3>
                <p><strong>Type:</strong> ${structure.type}</p>
                <p><strong>Rivière:</strong> ${structure.river}</p>
                <p><strong>Hauteur:</strong> ${structure.height || 'N/A'} m</p>
                <p><strong>Année:</strong> ${structure.year || 'N/A'}</p>
            </div>
        `;
    }

    clearMarkers() {
        this.layerGroup.clearLayers();
        this.markers = [];
    }

    filterByType(types) {
        this.markers.forEach(marker => {
            if (types.length === 0 || types.includes(marker.options.structureType)) {
                this.layerGroup.addLayer(marker);
            } else {
                this.layerGroup.removeLayer(marker);
            }
        });
    }
}

window.RiverStructureLayer = RiverStructureLayer;