let eventsData = [];

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
        showCalendar(); // Initialize the calendar after data is loaded 
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

// Creating the showCalendar function 
function showCalendar() {
    // Hide add event form when showing the calendar
    document.getElementById("addEventForm").style.display = "none"; 

    // Getting the id of the <main> on index.html
    const content = document.getElementById("content");
    // Clearing previous content
    content.innerHTML = ""; 

    if (eventsData.length === 0) {
        content.innerHTML = "<p>No events available</p>";
        return; // Exit function if no events
    }

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = 0;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Declaring calendarGrid and creating a <div> tag with a class="calendar-grid" inside
    const calendarGrid = document.createElement("div");
    calendarGrid.classList.add("calendar-grid");

    // Generate days in the month 
    for (let day = 1; day <= daysInMonth; day++) {
        // for each day in "calendar-grid" a <div> with a class="day" will be created
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");
        dayDiv.textContent = day;

        // Find events for the current day
        const dayEvents = eventsData.filter(event => {
            const eventDate = new Date(event.dateVenue);
            return (
                eventDate.getDate() === day &&
                eventDate.getMonth() === month &&
                eventDate.getFullYear() === year
            );
        });

        // If there are events, add a marker and set up the click handler 
        if (dayEvents.length > 0) {
            // Add a special class if there is an event
            dayDiv.classList.add("event-day"); 
            dayDiv.addEventListener("click", () => {
                // Pass events for this day 
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
    eventDetail.style.display = "none";
    eventDetail.classList.remove("fade-in");
}

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
        dateVenue: eventDate,          // Use the date input as the event date
        timeVenueUTC: eventTime,        // Use the time input as the event time
        sport: eventSport,              // Sport name
        teams: eventTeams,              // Teams/participants in a simple string format
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
