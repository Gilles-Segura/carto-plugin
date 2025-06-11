// This file handles the logic for managing different map layers, including toggling between street view and satellite view.

const mapLayers = {
    streetView: null,
    satelliteView: null,
    currentView: 'street', // Default view

    init: function(map) {
        this.streetView = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });

        this.satelliteView = L.tileLayer('https://{s}.satellite.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });

        this.streetView.addTo(map);
    },

    toggleView: function(map) {
        if (this.currentView === 'street') {
            map.removeLayer(this.streetView);
            this.satelliteView.addTo(map);
            this.currentView = 'satellite';
        } else {
            map.removeLayer(this.satelliteView);
            this.streetView.addTo(map);
            this.currentView = 'street';
        }
    }
};

export default mapLayers;