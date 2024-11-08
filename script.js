
function showCalendar() {
    const content = document.getElementById("content");
    content.innerHTML = ""; // Clearing previous content

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarGrid = document.createElement("div");
    calendarGrid.classList.add("calendar-grid");

    // Generate days in the month 
    for (let day = 1; day <= daysInMonth; day++) {
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
