let eventsData = []; // All events (unfiltered)
let filteredEvents = []; // Filtered events based on selected filters

// Fetch data from sportData.json file
fetch('sportData.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json(); // Parse JSON data
    })
    .then(data => {
        eventsData = data.data; // Store data globally
        filteredEvents = [...eventsData]; // Initialize filtered events as the full list
        showCalendar(); // Initialize the calendar after data is loaded
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

// Modified filterEvents function
function filterEvents() {
    const sportFilter = document.getElementById('sportFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    // Filter events based on selected filters
    filteredEvents = eventsData; // Reset filtered events to all data

    if (sportFilter) {
        filteredEvents = filteredEvents.filter(event => event.sport === sportFilter);
    }

    if (statusFilter) {
        filteredEvents = filteredEvents.filter(event => event.status === statusFilter);
    }

    // Display filtered events
    showFilteredEvents(filteredEvents); // Show filtered events in the calendar
}

// Show filtered events in the calendar
function showFilteredEvents(filteredEvents) {
    if (filteredEvents.length === 0) {
        document.getElementById("content").innerHTML = "<p>No events available for the selected filters.</p>";
    } else {
        showCalendar(filteredEvents); // Show the calendar with the filtered events
    }
}

// Modified showCalendar function to use filteredEvents
function showCalendar(filteredEvents = eventsData) {
    document.getElementById("addEventForm").style.display = "none"; // Hide add event form
    const content = document.getElementById("content");
    content.innerHTML = ""; // Clear previous content

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = 0; // January
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Create calendar grid
    const calendarGrid = document.createElement("div");
    calendarGrid.classList.add("calendar-grid");

    // Generate days in the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");
        dayDiv.textContent = day;

        // Find events for the current day
        const dayEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.dateVenue);
            return (
                eventDate.getDate() === day &&
                eventDate.getMonth() === month &&
                eventDate.getFullYear() === year
            );
        });

        if (dayEvents.length > 0) {
            dayDiv.classList.add("event-day");
            dayDiv.addEventListener("click", () => {
                showEventDetails(dayEvents);
            });
        }

        calendarGrid.appendChild(dayDiv);
    }

    content.appendChild(calendarGrid);
}


// Load calendar view initially 
document.addEventListener("DOMContentLoaded", () => {
    if (eventsData.length > 0) {
        showCalendar();
    }
});

// Creating a function that displays detailed information 
function showEventDetails(events) {
    const eventDetail = document.getElementById("eventDetail");

    // Clear previous details 
    eventDetail.innerHTML = "";

    // Loop through each event and display its details 
    events.forEach(event => {
        const homeTeam = event.homeTeam ? event.homeTeam.name : "N/A"; 
        const awayTeam = event.awayTeam ? event.awayTeam.name : "N/A"; 
        const stage = event.stage ? event.stage.name : "N/A";
        const status = event.status ? event.status : "N/A";
        const venue = event.stadium ? event.stadium : "Venue not available";
        const homeGoals = event.result && event.result.homeGoals !== null ? event.result.homeGoals : "N/A";
        const awayGoals = event.result && event.result.awayGoals !== null ? event.result.awayGoals : "N/A";
        const yellowCards = event.result && event.result.yellowCards.length > 0 ? event.result.yellowCards.join(", ") : "No yellow cards";
        const redCards = event.result && event.result.directRedCards.length > 0 ? event.result.directRedCards.join(", ") : "No red cards";

        eventDetail.innerHTML += `
            <div class="event-item">
                <h2>${homeTeam} vs. ${awayTeam}</h2>
                <p><strong>Competition:</strong> ${event.originCompetitionName}</p>
                <p><strong>Stage:</strong> ${stage}</p>
                <p><strong>Date:</strong> ${event.dateVenue}</p>
                <p><strong>Time:</strong> ${event.timeVenueUTC}</p>
                <p><strong>Venue:</strong> ${venue}</p>
                <p><strong>Status:</strong> ${status}</p>
                <p><strong>Score:</strong> ${homeGoals} - ${awayGoals}</p>
                <p><strong>Yellow Cards:</strong> ${yellowCards}</p>
                <p><strong>Red Cards:</strong> ${redCards}</p>
            </div>
        `;
    });

    // Show the event details and prevent clicks from interacting with other parts
    eventDetail.style.display = "block"; 
    eventDetail.classList.add("fade-in");

    // Add an event listener to close when clicking outside the details
    eventDetail.addEventListener("click", (e) => {
        if (e.target === eventDetail) {
            closeEventDetails();
        }
    });
}

function closeEventDetails() {
    const eventDetail = document.getElementById("eventDetail");
    eventDetail.classList.remove("fade-in");
    eventDetail.style.display = "none";
}

// Transition function for switching views
function switchView(hideElement, showElement) {
    // Start by hiding the element that should disappear
    hideElement.style.opacity = 0;

    // After the fade-out duration, set display: none on the hidden element
    setTimeout(() => {
        hideElement.style.display = 'none';

        // Now, make the new element visible and fade it in smoothly
        showElement.style.display = 'block';
        setTimeout(() => {
            showElement.style.opacity = 1;
        }, 10); // Slight delay to ensure display is set before opacity starts
    }, 500); // Match the timeout duration to your CSS transition duration (0.5s here)
}

// Event listeners for switching views
document.querySelector('#viewCalendarBtn').addEventListener('click', () => {
    switchView(document.getElementById('addEventForm'), document.getElementById('content'));
});

document.querySelector('#addEventBtn').addEventListener('click', () => {
    switchView(document.getElementById('content'), document.getElementById('addEventForm'));
});

function showAddEventForm() {
    // Hide the calendar view and show the add event form
    document.getElementById("content").innerHTML = ""; 
    document.getElementById("addEventForm").style.display = "block";
}

function addEvent(event) {
    // Prevent page refresh on form submission
    event.preventDefault();

    // Capture values from form fields
    const eventDate = document.getElementById("eventDate").value;
    const eventTime = document.getElementById("eventTime").value;
    const eventSport = document.getElementById("eventSport").value;
    const eventTeams = document.getElementById("eventTeams").value;

    // Create a new event object
    const newEvent = {
        dateVenue: eventDate,      // Use the date input as the event date
        timeVenueUTC: eventTime,   // Use the time input as the event time
        sport: eventSport,         // Sport name
        teams: eventTeams,         // Teams/participants in a simple string format
    };

    // Step 2: Add new event to the eventsData array
    eventsData.push(newEvent);

    // Step 3: Refresh the calendar view to display the new event
    showCalendar();

    // Step 4: Clear the form and hide it
    document.getElementById("addEventForm").style.display = "none";
    document.getElementById("eventDate").value = "";
    document.getElementById("eventTime").value = "";
    document.getElementById("eventSport").value = "";
    document.getElementById("eventTeams").value = "";
}

document.addEventListener('DOMContentLoaded', function () {
    const viewCalendarBtn = document.getElementById('viewCalendarBtn');
    const addEventBtn = document.getElementById('addEventBtn');
    // The main content area
    const calendarView = document.getElementById('content'); 
    // The add event area 
    const addEventForm = document.getElementById('addEventForm');

    // Initially hide the add event form with opacity and visibility
    addEventForm.style.opacity = '0';
    addEventForm.style.visibility = 'hidden';

    // Function to switch between views
    function switchView(showCalendar) {
        if (showCalendar) {
            // Show calendar, hide form
            addEventForm.style.opacity = '0';
            addEventForm.style.visibility = 'hidden';
            setTimeout(() => {
                calendarView.style.opacity = '1';
                calendarView.style.visibility = 'visible';
            }, 200);  // Small delay to allow opacity transition
        } else {
            // Show form, hide calendar
            calendarView.style.opacity = '0';
            calendarView.style.visibility = 'hidden';
            setTimeout(() => {
                addEventForm.style.opacity = '1';
                addEventForm.style.visibility = 'visible';
            }, 200);  // Small delay to allow opacity transition
        }
    }

    // Event listener for calendar button
    viewCalendarBtn.addEventListener('click', function () {
        switchView(true);
    });

    // Event listener for add event button
    addEventBtn.addEventListener('click', function () {
        switchView(false);
    });
});

function filterEvents() {
    const sportFilter = document.getElementById('sportFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    filteredEvents = eventsData;

    if (sportFilter) {
        filteredEvents = filteredEvents.filter(event => event.sport === sportFilter);
    }

    if (statusFilter) {
        filteredEvents = filteredEvents.filter(event => event.status === statusFilter);
    }

    // Display filtered events
    showCalendar(filteredEvents);
}

function showFilteredEvents(filteredEvents) {
    eventsData = filteredEvents; // Temporarily set eventsData to filtered list
    // Apply filters to the events data
    showCalendar(); // No need to pass filters, just render filtered events
}

document.getElementById('sportFilter').addEventListener('change', filterEvents);
document.getElementById('statusFilter').addEventListener('change', filterEvents);

// Function to display the calendar or events based on filtered data
function showFilteredCalendar(filteredEvents) {
    const content = document.getElementById("content");
    content.innerHTML = ""; // Clear the content

    if (filteredEvents.length === 0) {
        content.innerHTML = "<p>No events available for the selected filters.</p>";
        return;
    }

    // Proceed to render calendar or event list based on filteredEvents...
    // This may involve calling showCalendar or any other function you've defined
    // to render events based on filteredEvents instead of eventsData.
}

// Function to reset the filters and show the calendar
function resetFiltersAndShowCalendar() {
    // Reset the filter values to index 0 (default)
    document.getElementById('sportFilter').selectedIndex = 0;
    document.getElementById('statusFilter').selectedIndex = 0;

    // Call filterEvents to apply the default filters
    filterEvents();  // Make sure this function applies the filters correctly
}

// Function to hide the filters when Add Event is clicked
function hideFilters() {
    document.getElementById('filters').classList.add('hidden');
}

// Function to show the filters when Calendar is clicked
function showFilters() {
    document.getElementById('filters').classList.remove('hidden');
}

// Event listener for Add Event button
document.querySelector('#addEventBtn').addEventListener('click', () => {
    // Hide filters and show add event form
    switchView(document.getElementById('content'), document.getElementById('addEventForm'));
    hideFilters();  // Hide filters when Add Event is clicked
});

// Event listener for View Calendar button
document.querySelector('#viewCalendarBtn').addEventListener('click', () => {
    // Show filters and calendar view, reset filters
    switchView(document.getElementById('addEventForm'), document.getElementById('content'));
    showFilters();  // Show filters when Calendar is clicked
    resetFiltersAndShowCalendar(); // Reset filters and display calendar
});

