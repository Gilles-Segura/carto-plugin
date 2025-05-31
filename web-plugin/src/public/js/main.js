document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = '/api/data'; // Adjust the API endpoint as needed

    // Function to fetch data from the API
    async function fetchData() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            displayData(data);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    // Function to display data on the web page
    function displayData(data) {
        const dataContainer = document.getElementById('data-container');
        dataContainer.innerHTML = ''; // Clear previous data

        data.forEach(item => {
            const div = document.createElement('div');
            div.textContent = item.name; // Adjust based on the data structure
            dataContainer.appendChild(div);
        });
    }

    // Initial data fetch
    fetchData();
});