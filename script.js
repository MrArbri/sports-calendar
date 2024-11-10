let eventsData = [];

// Fetch data from sportData.json file 
fetch('sportData.json')

    .then(response => {
        if (!response.ok) {
            throw new Error ('Network response was not ok.');
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
    // Getting the id of the <main> on index.html
    const content = document.getElementById("content");
    content.innerHTML = ""; // Clearing previous content

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

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
            return eventDate.getDate() === day &&
            eventDate.getMonth() === month &&
            eventDate.getFullYear() === year;
        });

        // If there are events, add a marker and set up the click handler 
        if (dayEvents.length > 0) {
            dayDiv.classList.add("event-day"); // Add a special class if there is an event
            dayDiv.addEventListener("click", () => {
            showEventDetails(dayEvents); // Pass events for this day 
        });
        }
        
        calendarGrid.appendChild(dayDiv);
    }

    content.appendChild(calendarGrid)
}

// Load calendar view initially 
document.addEventListener("DOMContentLoaded", () => {
    if (eventsData.length === 0) {
        showCalendar();
    }
});

// Creating a function that displays detailed information 
function showEventDetails(events) {
    const eventDetail = document.getElementById("eventDetail");

    // Clear previous details and display each event 
    eventDetail.innerHTML = events.map(event => `
    <h2>${event.homeTeam.name} vs. ${eventData.awayTeam.name}</h2>
    <p>Date: ${event.dateVenue}</p>
    <p>Time: ${event.timeVenueUTC}</p>
    <p>Competition: ${event.originCompetitionName}</p>
    `).join('') ;

    eventDetail.style.display = "block"; // Show the detail view 
}