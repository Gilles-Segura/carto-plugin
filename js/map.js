document.addEventListener('DOMContentLoaded', () => {
    // Initialize the map with Europe centered view
    const map = L.map('map').setView([48.8566, 2.3522], 5);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add map controls
    document.getElementById('zoomIn').addEventListener('click', () => {
        map.zoomIn();
    });
    
    document.getElementById('zoomOut').addEventListener('click', () => {
        map.zoomOut();
    });
    
    document.getElementById('centerMap').addEventListener('click', () => {
        map.setView([48.8566, 2.3522], 5);
    });

    // Connect filter buttons
    document.getElementById('filter-by-properties').addEventListener('click', () => {
        togglePanel('property-filter-panel');
    });
    
    document.getElementById('filter-by-user').addEventListener('click', () => {
        togglePanel('user-filter-panel');
    });
    
    document.getElementById('download-data').addEventListener('click', () => {
        togglePanel('download-panel');
    });

    // Function to toggle filter panels
    function togglePanel(panelId) {
        const panels = document.querySelectorAll('.filter-panel');
        panels.forEach(panel => {
            if (panel.id === panelId) {
                panel.classList.toggle('hidden');
            } else {
                panel.classList.add('hidden');
            }
        });
    }

    // Après l'initialisation de la carte
    let riverLayer;

    // Quand la carte est prête
    map.whenReady(() => {
        riverLayer = new RiverStructureLayer(map);
        riverLayer.loadStructures();
    });
});