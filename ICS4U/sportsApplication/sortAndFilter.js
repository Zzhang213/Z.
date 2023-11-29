let filteredGames = [];
let isNameSortedAscending = true;
let isColumnSortedAscending = {};

function filterGame() {
    const earliestDateInput = document.getElementById('earliestDate').value;
    const latestDateInput = document.getElementById('latestDate').value;

    const earliestDate = earliestDateInput ? new Date(earliestDateInput) : new Date("1970-01-01");
    const latestDate = latestDateInput ? new Date(latestDateInput) : new Date();

    filteredGames = games.filter(game => {
        const gameDate = new Date(game.date);
        return gameDate >= earliestDate && gameDate <= latestDate;
    });

    displayFilteredGames(filteredGames);

    currentPage = 1;
    displayGames();
}


function displayFilteredGames(filteredGames) {
    const gamesContainer = document.getElementById('gamesContainer');
    gamesContainer.innerHTML = '';

    filteredGames.forEach(game => {
        const gameCard = createGameCard(game);
        gamesContainer.appendChild(gameCard);
    });
}

function clearFilter() {
    document.getElementById('earliestDate').value = '';
    document.getElementById('latestDate').value = '';

    filteredGames = [];

    displayStatsFromAllGames();
    displayAllGames();

    displayPaginationControls();

    currentPage = 1;
    displayGames();
}


function displayStatsFromAllGames() {
    updateData();
}

function displayAllGames() {
    const gamesContainer = document.getElementById('gamesContainer');
    gamesContainer.innerHTML = '';

    games.forEach(game => {
        const gameCard = createGameCard(game);
        gamesContainer.appendChild(gameCard);
    });

}

function sortTableName() {
    const tableBody = document.getElementById('statsTableBody');
    let rows = Array.from(tableBody.querySelectorAll('tr'));

    isNameSortedAscending = !isNameSortedAscending;

    rows.sort((rowA, rowB) => {
        const teamNameA = rowA.cells[0].innerText.toLowerCase();
        const teamNameB = rowB.cells[0].innerText.toLowerCase();

        if (isNameSortedAscending) {
            return teamNameA.localeCompare(teamNameB);
        } else {
            return teamNameB.localeCompare(teamNameA);
        }
    });

    tableBody.innerHTML = '';
    rows.forEach(row => tableBody.appendChild(row));
}



function sortTableNumber(columnIndex) {
    const tableBody = document.getElementById('statsTableBody');
    let rows = Array.from(tableBody.querySelectorAll('tr'));

    if (isColumnSortedAscending[columnIndex] === undefined) {
        isColumnSortedAscending[columnIndex] = true;
    } else {
        isColumnSortedAscending[columnIndex] = !isColumnSortedAscending[columnIndex];
    }

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

    tableBody.innerHTML = '';
    rows.forEach(row => tableBody.appendChild(row));
}





