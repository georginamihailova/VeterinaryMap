// Initialize the map
const map = L.map('map').setView([41.6082, 21.7453], 8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

const markers = L.layerGroup().addTo(map);

// Load clinic data and initialize the application
async function loadData() {
    try {
        const response = await fetch('http://localhost:3001/api/data');
        const data = await response.json();

        const clinics = data.map(item => ({
            ...item.veterinary,
            type: item.buildingType
        }));

        populateFilters(clinics);
        updateMap(clinics);

        // Set up event listeners
        document.getElementById('city-select').addEventListener('change', function() {
            const selectedCity = this.value;
            const selectedType = document.getElementById('type-select').value;
            filterClinics(selectedCity, selectedType);
        });

        document.getElementById('type-select').addEventListener('change', function() {
            const selectedType = this.value;
            const selectedCity = document.getElementById('city-select').value;
            filterClinics(selectedCity, selectedType);
        });

    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Populate filter dropdowns
function populateFilters(clinics) {
    const citySelect = document.getElementById('city-select');
    const typeSelect = document.getElementById('type-select');

    // Get unique cities
    const cities = [...new Set(clinics.map(c => c.location))].sort();

    // Add city options
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });

    // Type select is already populated in HTML
}

// Filter clinics based on selections
function filterClinics(city, type) {
    const url = new URL('http://localhost:3001/api/data');
    if (city) url.searchParams.append('municipality', city);
    if (type) url.searchParams.append('type', type);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let clinics = data.map(item => ({
                ...item.veterinary,
                type: item.buildingType
            }));

            if (city) {
                clinics = clinics.filter(c => c.location === city);
            }

            if (type) {
                clinics = clinics.filter(c => c.type === type);
            }

            updateMap(clinics);
        });
}

// Update map with clinics
function updateMap(clinics) {
    markers.clearLayers();

    clinics.forEach(clinic => {
        if (clinic.latitude && clinic.longitude) {
            const marker = L.marker([clinic.latitude, clinic.longitude]).addTo(markers);
            marker.bindPopup(`
                <strong>${clinic.name}</strong><br>
                <em>${clinic.type}</em><br>
                ${clinic.address}<br>
                ${clinic.location}
            `);
        }
    });

    // Update clinic count
    document.getElementById('clinic-count').textContent = clinics.length;

    // Adjust map view if we have clinics
    if (clinics.length > 0) {
        const bounds = L.latLngBounds(clinics.map(c => [c.latitude, c.longitude]));
        map.fitBounds(bounds);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', loadData);