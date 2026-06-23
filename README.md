# Manga Blossom

A React web application that allows users to search for manga and view details using the official MangaDex API.

This project was built as a learning journey to transition from basic React tutorials to real world, production ready frontend architecture.

## Features

- **Manga Search**: Fetch real time data from the MangaDex API.
- **Instant Navigation**: Uses React Router for seamless, instant transitions between the search page and the manga details page.
- **Race Condition Prevention**: Uses `AbortController` inside `useEffect` to handle fast typing and prevent stale state bugs.

## Technologies Used

- React (with Vite)
- TypeScript
- React Router DOM
- Axios (for API data fetching)
- Vanilla CSS (CSS Variables, Grid, Keyframes)

## Run it locally

If you want to download and run this code on your own machine:

1. Clone this repository to your computer.
2. Open your terminal in the project folder.
3. Run `npm install` to download the dependencies.
4. Run `npm run dev` to start the local server.
5. Open the `localhost` link provided in the terminal.
