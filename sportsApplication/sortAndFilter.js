let filteredGames = [];
let isNameSortedAscending = true;
let isColumnSortedAscending = {};

// Function to show games within a certian range
function filterGame() {
    // Retrieve the input values for date filtering
    const earliestDateInput = document.getElementById('earliestDate').value;
    const latestDateInput = document.getElementById('latestDate').value;

    // Set the earliest and latest dates for filtering, defaulting to a wide range if no input is provided
    const earliestDate = earliestDateInput ? new Date(earliestDateInput) : new Date("1970-01-01");
    const latestDate = latestDateInput ? new Date(latestDateInput) : new Date();

    // Filter the games array based on the specified date range
    filteredGames = games.filter(game => {
        const gameDate = new Date(game.date);
        return gameDate >= earliestDate && gameDate <= latestDate;
    });

    // Display the filtered games
    displayFilteredGames(filteredGames);

    // Reset the current page to the first page and display the games
    currentPage = 1;
    displayGames();
}

// Function to display filtered games
function displayFilteredGames(filteredGames) {
    // Get the container element for displaying games
    const gamesContainer = document.getElementById('gamesContainer');
    gamesContainer.innerHTML = ''; // Clear any existing content

    // Iterate over the filtered games and display them
    filteredGames.forEach(game => {
        const gameCard = createGameCard(game); // Create a card for each game
        gamesContainer.appendChild(gameCard); // Append the card to the container
    });
}

// Function to  clear current filter
function clearFilter() {
    // Clear the filter input fields
    document.getElementById('earliestDate').value = '';
    document.getElementById('latestDate').value = '';

    // Reset the filteredGames array
    filteredGames = [];

    // Display stats and games from all games (not just filtered ones)
    displayStatsFromAllGames(); // Function not shown in your code, assumed to reset stats display
    displayAllGames(); // Function not shown in your code, assumed to reset games display

    // Update the pagination controls
    displayPaginationControls();

    // Reset the current page to the first page and display the games
    currentPage = 1;
    displayGames();
}

// Function to display stats from all games
function displayStatsFromAllGames() {
    // Call updateData to refresh and display statistics from all games
    updateData();
}

// Function to display games
function displayAllGames() {
    // Get the container for displaying game cards
    const gamesContainer = document.getElementById('gamesContainer');
    gamesContainer.innerHTML = ''; // Clear any existing game cards

    // Create and append a card for each game in the games array
    games.forEach(game => {
        const gameCard = createGameCard(game); // Create a card for the game
        gamesContainer.appendChild(gameCard); // Append the card to the container
    });
}

// Function to sort rows by team name
function sortTableName() {
    // Get all the rows from the table body
    const tableBody = document.getElementById('statsTableBody');
    let rows = Array.from(tableBody.querySelectorAll('tr'));

    // Toggle the sorting order
    isNameSortedAscending = !isNameSortedAscending;

    // Sort the rows based on team names in ascending or descending order
    rows.sort((rowA, rowB) => {
        const teamNameA = rowA.cells[0].innerText.toLowerCase();
        const teamNameB = rowB.cells[0].innerText.toLowerCase();

        if (isNameSortedAscending) {
            return teamNameA.localeCompare(teamNameB);
        } else {
            return teamNameB.localeCompare(teamNameA);
        }
    });

    // Clear the table and append sorted rows
    tableBody.innerHTML = '';
    rows.forEach(row => tableBody.appendChild(row));
}

// Function to sort rows by number, must input a column of numbers
function sortTableNumber(columnIndex) {
    // Get all the rows from the table body
    const tableBody = document.getElementById('statsTableBody');
    let rows = Array.from(tableBody.querySelectorAll('tr'));

    // Initialize or toggle the sorting order for the specified column
    if (isColumnSortedAscending[columnIndex] === undefined) {
        isColumnSortedAscending[columnIndex] = true;
    } else {
        isColumnSortedAscending[columnIndex] = !isColumnSortedAscending[columnIndex];
    }

    // Sort the rows based on numeric values in the specified column
    rows.sort((rowA, rowB) => {
        let valueA = rowA.cells[columnIndex].innerText.replace('%', '');
        let valueB = rowB.cells[columnIndex].innerText.replace('%', '');

        valueA = isNaN(valueA) ? 0 : parseFloat(valueA);
        valueB = isNaN(valueB) ? 0 : parseFloat(valueB);

        if (isColumnSortedAscending[columnIndex]) {
            return valueA - valueB;
        } else {
            return valueB - valueA;
        }
    });

    // Clear the table and append sorted rows
    tableBody.innerHTML = '';
    rows.forEach(row => tableBody.appendChild(row));
}








