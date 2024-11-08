
// Fetch data from sportData.json file 
fetch('sportData.json')

    .then(response => {
        if (!response.ok) {
            throw new Error ('Network response was not ok.');
        }
        return response.json(); // Parse JSON data 
    })

    .then(data => {
        console.log(data); // Display data in the console to verify 
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

        // Placeholder for events 
        dayDiv.addEventListener("click", () => {
            alert(`Details for events on ${day}/${month + 1}/${year}`)
        });
        
        calendarGrid.appendChild(dayDiv);
    }

    content.appendChild(calendarGrid)
}

// Load calendar view initially 
document.addEventListener("DOMContentLoaded", showCalendar);
