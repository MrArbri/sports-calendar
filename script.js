// Global variable for storing events 
let eventsData = []; 

// Fetch data from sportData.json file 
fetch('sportData.json')
    .then(response => response.json())
    .then(data => {
        eventsData = data.data;
        showCalendar();
    })
    .catch(error => console.error('Fetch error:', error));

// Filter events based on selected criteria 
function filterEvents() {
    const sportFilter = document.getElementById('sportFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    const filteredEvents = eventsData.filter(event => 
        (!sportFilter || event.sport === sportFilter) &&
        (!statusFilter || event.status === statusFilter)
    );
    
    showCalendar(filteredEvents);
}

// Show calendar view 
function showCalendar(events = eventsData) {
    const content = document.getElementById("content");
    content.innerHTML = "";
    const daysInMonth = new Date(new Date().getFullYear(), 1, 0).getDate();
    
    const calendarGrid = document.createElement("div");
    calendarGrid.classList.add("calendar-grid");

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");
        dayDiv.textContent = day;

        const dayEvents = events.filter(event => {
            const eventDate = new Date(event.dateVenue);
            return eventDate.getDate() === day && eventDate.getMonth() === 0;
        });

        if (dayEvents.length > 0) {
            dayDiv.classList.add("event-day");
            dayDiv.addEventListener("click", () => showEventDetails(dayEvents));
        }
        calendarGrid.appendChild(dayDiv);
    }
    content.appendChild(calendarGrid);
}

// Creating a function that displays detailed information 
function showEventDetails(events) {
    const eventDetail = document.getElementById("eventDetail");
    eventDetail.innerHTML = `
        <button id="closeEventDetailBtn" class="close-button">X</button>
        ${events.map(event => `
            <div class="event-item">
                <h2>${event.homeTeam?.name ?? "N/A"} vs. ${event.awayTeam?.name ?? "N/A"}</h2>
                <p><strong>Competition:</strong> ${event.originCompetitionName}</p>
                <p><strong>Stage:</strong> ${event.stage?.name ?? "N/A"}</p>
                <p><strong>Date:</strong> ${event.dateVenue}</p>
                <p><strong>Time:</strong> ${event.timeVenueUTC}</p>
                <p><strong>Venue:</strong> ${event.stadium ?? "Venue not available"}</p>
                <p><strong>Status:</strong> ${event.status ?? "N/A"}</p>
                <p><strong>Score:</strong> ${event.result?.homeGoals ?? "N/A"} - ${event.result?.awayGoals ?? "N/A"}</p>
                <p><strong>Yellow Cards:</strong> ${event.result?.yellowCards?.join(", ") || "No yellow cards"}</p>
                <p><strong>Red Cards:</strong> ${event.result?.directRedCards?.join(", ") || "No red cards"}</p>
            </div>
        `).join("")}`;

    eventDetail.style.display = "block";
    eventDetail.classList.add("fade-in");

    // Attach event listener to close button
    document.getElementById("closeEventDetailBtn").addEventListener("click", closeEventDetails);
}

// Close event details 
function closeEventDetails() {
    const eventDetail = document.getElementById("eventDetail");
    eventDetail.style.display = "none";
}

// Event form functions 
function showAddEventForm() {
    document.getElementById("content").innerHTML = "";
    document.getElementById("addEventForm").style.display = "block";
}

function addEvent(event) {
    event.preventDefault();
    const newEvent = {
        dateVenue: document.getElementById("eventDate").value,
        timeVenueUTC: document.getElementById("eventTime").value,
        sport: document.getElementById("eventSport").value,
        teams: document.getElementById("eventTeams").value,
    };
    eventsData.push(newEvent);
    resetAddEventForm();
    showCalendar();
    switchView(document.getElementById('addEventForm'), document.getElementById('content'), false);
}

function resetAddEventForm() {
    document.getElementById("eventDate").value = "2024-01-01";
    document.getElementById("eventTime").value = "09:00";
    document.getElementById("eventSport").value = "";
    document.getElementById("eventTeams").value = "";
    document.getElementById("addEventForm").style.display = "none";
}

// Transition function for switching views 
function switchView(hideElement, showElement, hideFilters = false) {
    // Start by hiding the element that should disappear
    hideElement.style.opacity = 0;

    // After the fade-out duration, set display: none on the hidden element
    setTimeout(() => {
        hideElement.style.visibility = 'hidden';
        hideElement.style.display = 'none'; // Hide it completely

        // Now, make the new element visible and fade it in smoothly
        showElement.style.visibility = 'visible';
        showElement.style.display = 'block'; // Ensure it's displayed
        // Slight delay to ensure display is set before opacity starts
        setTimeout(() => {
            showElement.style.opacity = 1;
        }, 10);

        // Hide and show filters during switching
        if (hideFilters) {
            document.getElementById('filters').classList.add('hidden');
        } else {
            document.getElementById('filters').classList.remove('hidden');
        }
    }, 500); // Match the timeout duration to your CSS transition duration (0.5s here)
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addEventBtn').addEventListener('click', () => {
        switchView(document.getElementById('content'), document.getElementById('addEventForm'), true);
    });

    document.getElementById('viewCalendarBtn').addEventListener('click', () => {
        switchView(document.getElementById('addEventForm'), document.getElementById('content'), false);
        resetFiltersAndShowCalendar();
    });

    document.getElementById('sportFilter').addEventListener('change', filterEvents);
    document.getElementById('statusFilter').addEventListener('change', filterEvents);
});

// Function to reset the filters and show the calendar 
function resetFiltersAndShowCalendar() {
    document.getElementById('sportFilter').selectedIndex = 0;
    document.getElementById('statusFilter').selectedIndex = 0;
    filterEvents();
}

// Event listener for Add Event button
document.querySelector('#addEventBtn').addEventListener('click', () => {
    // Reset filters before switching to the Add Event form
    resetFiltersAndShowCalendar();

    // Hide calendar and show add event form
    switchView(document.getElementById('content'), document.getElementById('addEventForm'), true); // Hide filters when Add Event is clicked
});
