# Sports Event Calendar

## Overview

The **Sports Event Calendar** is a web-based application that allows users to view, filter, and manage sports events for the month of January.
Users can:

- View a calendar that displays sports events for each day.
- Filter events by sport or status.
- Add new events to the calendar.
- View detailed information for each event, including teams and event times.

This application is built with plain HTML, CSS, and JavaScript and does not require a server-side backend. The data is stored in a JSON file, and interactions are handled dynamically on the front-end.

You can try the live version of the application here:
[**Sports Event Calendar - Live Demo**](https://mrarbri.github.io/sports-calendar/)

## Features

- A calendar displaying all the sports events for January.
- Ability to filter events by sport and status.
- A form to add new events to the calendar.
- Event details pop-up when clicking on any day with an event.

## Files

This project consists of the following files:

- `index.html`: The main HTML structure for the application.
- `style.css`: The CSS for styling the application.
- `script.js`: The JavaScript file handling the application logic.
- `sportData.json`: A JSON file containing sports event data for January.
- `README.md`: This documentation file.

## Running the Application

To run the application, follow these steps:

1. Clone or download the repository to your local machine.
   (https://github.com/MrArbri/sports-calendar.git)
2. Open the `index.html` file in your web browser.
3. The calendar will be displayed with events for the month of January, and you can interact with the application directly in the browser.

No server setup is required for this application as it is fully client-side.

## Assumptions & Decisions

1. **January Data**: The calendar is currently pre-filled with events for January 2024. The application assumes the events are available in the `sportData.json` file.
2. **Filtering**: The filter functionality allows users to filter events by sport or status. If no filter is applied, all events are shown.
3. **No Backend**: This application does not require a server-side component. All data handling (adding, filtering) happens on the client side.

## Dependencies

This project does not rely on any external libraries or frameworks. It is built using vanilla JavaScript, HTML, and CSS.

## License

This project is open-source and available under the MIT License.
