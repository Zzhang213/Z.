// Array initialized for local storage
let games = JSON.parse(localStorage.getItem('games')) || [];
// Check if the games array is empty, and if so, populate it
if (games.length === 0) {
    // Loop to generate 100 game objects
    for (let i = 0; i < 100; i++) {
        games.push(generateGame(i + 1)); // Add a new game object to the array
    }
    // Save the newly created games array back to localStorage
    localStorage.setItem('games', JSON.stringify(games));
}
// Initialize currentPage variable for pagination purposes
let currentPage = 1;
// Set the number of games to show per page
const gamesPerPage = 9;

// Function to generate a game object
function generateGame(id) {
    // Array of team names
    const teams = ["Toronto Raptors", "Boston Celtics", "Philadelphia 76ers", "Brooklyn Nets", "New York Knicks",
        "Milwaukee Bucks", "Indiana Pacers", "Chicago Bulls", "Detroit Pistons", "Cleveland Cavaliers",
        "Miami Heat", "Orlando Magic", "Charlotte Hornets", "Washington Wizards", "Atlanta Hawks",
        "Denver Nuggets", "Oklahoma City Thunder", "Utah Jazz", "Portland Trail Blazers", "Minnesota Timberwolves",
        "Los Angeles Lakers", "Los Angeles Clippers", "Phoenix Suns", "Sacramento Kings", "Golden State Warriors",
        "Houston Rockets", "Dallas Mavericks", "Memphis Grizzlies", "San Antonio Spurs", "New Orleans Pelicans"];

     // Randomly select a home team from the teams array
    const homeTeam = teams[Math.floor(Math.random() * teams.length)];
    let awayTeam;
    // Randomly select an away team, ensuring it's different from the home team
    do {
        awayTeam = teams[Math.floor(Math.random() * teams.length)];
    } while (awayTeam === homeTeam);

    // Generate random scores for the home and away teams
    const scoreHome = Math.floor(Math.random() * 100) + 50;
    const scoreAway = Math.floor(Math.random() * 100) + 50;

    // Define the start and end dates for the game schedule
    const startDate = new Date(2022, 9, 18);
    const endDate = new Date(2023, 3, 9);
    const timeDiff = endDate - startDate;
    // Generate a random date within the defined schedule
    const randomDate = new Date(startDate.getTime() + Math.random() * timeDiff);

    // Return a game object with all the details
    return {
        id: id,
        date: randomDate.toISOString().split('T')[0], // Format the date as YYYY-MM-DD
        homeTeam: homeTeam,
        scoreHome: scoreHome,
        awayTeam: awayTeam,
        awayScore: scoreAway
    };
}

// Function to add another game event
function addGame() {
    // Retrieve values from the form inputs
    const dateInput = document.getElementById('date').value;
    const homeTeam = document.getElementById('homeTeam').value;
    const scoreHome = document.getElementById('scoreHome').value;
    const awayTeam = document.getElementById('awayTeam').value;
    const awayScore = document.getElementById('awayScore').value;

    // Validate input: check if any field is empty
    if (!dateInput || !homeTeam || !scoreHome || !awayTeam || !awayScore) {
        alert("Please fill in all fields.");
        return;
    }

    // Additional validation: check if 'Team Name' is selected as a team
    if (homeTeam === "Team Name" || awayTeam === "Team Name") {
        alert("Please select both teams.");
        return;
    }

    // Date validation: ensure the game date falls within the specified range
    const date = new Date(dateInput);
    const startDate = new Date("2022-10-18");
    const endDate = new Date("2023-04-09");
    if (date < startDate || date > endDate) {
        alert("Please select a date between October 18, 2022, and April 9, 2023.");
        return;
    }

    // Create a new game object with the input data
    const game = {
        date: date.toISOString(),
        homeTeam: homeTeam,
        scoreHome: scoreHome,
        awayTeam: awayTeam,
        awayScore: awayScore
    };

    // Add the new game to the games array
    games.push(game);

    // Update the games data in localStorage
    localStorage.setItem('games', JSON.stringify(games));

    // Refresh the data display and game list
    updateData();
    displayGames();

    // Reset the form fields to empty
    document.getElementById('date').value = '';
    document.getElementById('homeTeam').value = '';
    document.getElementById('scoreHome').value = '';
    document.getElementById('awayTeam').value = '';
    document.getElementById('awayScore').value = '';
}

// Function to uqdate for table
function updateData() {
    // Initialize an object to hold team statistics
    const stats = {};

    // Iterate over each game in the games array
    games.forEach(game => {
        // Extract the home and away team names and their respective scores from the game
        const homeTeam = game.homeTeam;
        const awayTeam = game.awayTeam;
        const homeScore = parseInt(game.scoreHome);
        const awayScore = parseInt(game.awayScore);

        // Initialize statistics for the home team if it doesn't already exist in stats
        if (!stats[homeTeam]) initTeamStats(stats, homeTeam);
        // Initialize statistics for the away team if it doesn't already exist in stats
        if (!stats[awayTeam]) initTeamStats(stats, awayTeam);

        // Update the stats based on the game outcome
        if (homeScore > awayScore) {
            // If the home team wins, update their stats as a win and the away team's as a loss
            updateTeamStats(stats, homeTeam, 'win', 'home');
            updateTeamStats(stats, awayTeam, 'loss', 'road');
        } else {
            // If the away team wins, update their stats as a win and the home team's as a loss
            updateTeamStats(stats, awayTeam, 'win', 'road');
            updateTeamStats(stats, homeTeam, 'loss', 'home');
        }
    });

    // Call function to display updated statistics
    displayStats(stats);
}

// Function to intialize data
function initTeamStats(stats, team) {
    // Initialize statistics for a team with zero counts in various categories
    stats[team] = {
        wins: 0,
        losses: 0,
        homeWins: 0,
        homeLosses: 0,
        roadWins: 0,
        roadLosses: 0,
        winStreak: 0,
        lossStreak: 0,
        currentWinStreak: 0,
        currentLossStreak: 0
    };
}

// Function to update the current team data on displayed 
function updateTeamStats(stats, team, result, location) {
    // Get the stats object for the specified team
    const teamStats = stats[team];

    // Update stats based on the game result (win or loss)
    if (result === 'win') {
        // Update win-related statistics
        teamStats.wins++;
        teamStats.currentWinStreak++;
        teamStats.currentLossStreak = 0;
        if (teamStats.currentWinStreak > teamStats.winStreak) teamStats.winStreak = teamStats.currentWinStreak;
        if (location === 'home') teamStats.homeWins++;
        else teamStats.roadWins++;
    } else {
        // Update loss-related statistics
        teamStats.losses++;
        teamStats.currentLossStreak++;
        teamStats.currentWinStreak = 0;
        if (teamStats.currentLossStreak > teamStats.lossStreak) teamStats.lossStreak = teamStats.currentLossStreak;
        if (location === 'home') teamStats.homeLosses++;
        else teamStats.roadLosses++;
    }
}

// Function to display stats on table
function displayStats(stats) {
    // Get the table body element where stats will be displayed
    const tableBody = document.getElementById('statsTableBody');
    tableBody.innerHTML = '';

    // Loop through each team to display their statistics
    for (const team in stats) {
        const teamStats = stats[team];
        // Calculate the win rate percentage
        const winRate = teamStats.wins + teamStats.losses > 0 ? 
                        Math.floor((teamStats.wins / (teamStats.wins + teamStats.losses)) * 100) : 0;
        // Format home and road records
        const homeRecord = `${teamStats.homeWins} - ${teamStats.homeLosses}`;
        const roadRecord = `${teamStats.roadWins} - ${teamStats.roadLosses}`;
        // Determine the current streak (win or loss)
        const streak = teamStats.winStreak >= teamStats.lossStreak ? `W${teamStats.winStreak}` : `L${teamStats.lossStreak}`;

        // Create a table row for the team stats
        const row = `<tr>
            <td><a href="team.html?team=${encodeURIComponent(team)}">${team}</a></td>
            <td>${teamStats.wins}</td>
            <td>${teamStats.losses}</td>
            <td>${winRate}%</td>
            <td>${homeRecord}</td>
            <td>${roadRecord}</td>
            <td>${streak}</td>
        </tr>`;

        // Append the row to the table body
        tableBody.innerHTML += row;
    }
}

// Function to create a new game card
function createGameCard(game) {
    // Create a new div element to serve as a card
    const card = document.createElement('div');
    card.className = 'card game-card'; // Assign class names for styling
    card.style.width = '340px'; // Set width of the card

    // Create a header for the card
    const header = document.createElement('header');
    header.className = 'card-header';
    header.textContent = `Game Date: ${new Date(game.date).toLocaleDateString()}`; // Display game date
    header.style.padding = '20px';
    header.style.textAlign = 'center';

    // Create the main content area of the card
    const content = document.createElement('div');
    content.className = 'card-content';

    // Create an inner div for content details
    const contentInner = document.createElement('div');
    contentInner.className = 'content';

    // Extract the last word of the team names to display
    const homeTeamLastName = game.homeTeam.split(' ').pop();
    const awayTeamLastName = game.awayTeam.split(' ').pop();

    // Set the inner HTML of the content area
    contentInner.innerHTML = `
        ${homeTeamLastName} vs ${awayTeamLastName}
        <br>
        Score: ${game.scoreHome} - ${game.awayScore}
    `;

    // Append the header and content to the card
    card.appendChild(header);
    card.appendChild(content);
    content.appendChild(contentInner);

    return card; // Return the complete card element
}

// Function that displays game card
function displayGames(page = 1) {
    currentPage = page; // Set the current page
    const gamesContainer = document.getElementById('gamesContainer'); // Get the container for the games
    gamesContainer.innerHTML = ''; // Clear existing content

    // Determine which games to display (filtered or all)
    const currentGames = filteredGames.length > 0 ? filteredGames : games;
    // Sort the games by date, most recent first
    const sortedGames = currentGames.sort((a, b) => new Date(b.date) - new Date(a.date));
    // Calculate the starting index based on the current page
    const startIndex = (page - 1) * gamesPerPage;
    // Select the games to be displayed on the current page
    const selectedGames = sortedGames.slice(startIndex, startIndex + gamesPerPage);

    // Create and append game cards for each selected game
    selectedGames.forEach(game => {
        const gameCard = createGameCard(game);
        gamesContainer.appendChild(gameCard);
    });

    // Call function to display pagination controls
    displayPaginationControls();
}

// Function to organize pagination 
function displayPaginationControls() {
    // Get the container for pagination controls
    const paginationContainer = document.getElementById('paginationContainer');
    // Calculate the total number of games (considering filtered games if any)
    const totalGames = filteredGames.length > 0 ? filteredGames.length : games.length;
    // Calculate the total number of pages needed for pagination
    const totalPages = Math.ceil(totalGames / gamesPerPage);

    // Clear any existing pagination controls
    paginationContainer.innerHTML = '';

    // Create a navigation wrapper for pagination
    const paginationWrapper = document.createElement('nav');
    paginationWrapper.className = 'pagination is-centered'; // Assign class for styling
    paginationWrapper.setAttribute('role', 'navigation');
    paginationWrapper.setAttribute('aria-label', 'pagination');

    // Create an unordered list for pagination links
    const paginationList = document.createElement('ul');
    paginationList.className = 'pagination-list';

    // Loop through all pages and create pagination links
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li'); // Create list item for each page
        const pageLink = document.createElement('a'); // Create an anchor element for the page link
        pageLink.className = 'pagination-link'; // Assign class for styling
        pageLink.textContent = i; // Set the page number as link text

        // Highlight the current page
        if (i === currentPage) {
            pageLink.classList.add('is-current'); // Add class to indicate the current page
        }

        // Add a click event listener to change pages when clicked
        pageLink.addEventListener('click', () => displayGames(i));
        pageItem.appendChild(pageLink); // Append the link to the list item
        paginationList.appendChild(pageItem); // Append the list item to the pagination list
    }

    // Append the pagination list to the navigation wrapper
    paginationWrapper.appendChild(paginationList);
    // Append the pagination wrapper to the pagination container
    paginationContainer.appendChild(paginationWrapper);
}

// Function to show standings table
function showStandings() {
    // Display the standings section and hide the games section
    document.getElementById('standings-section').style.display = 'block';
    document.getElementById('games-section').style.display = 'none';

    // Update the tab styles to reflect the current view
    document.getElementById('standings-tab').classList.add('is-active');
    document.getElementById('games-tab').classList.remove('is-active');

    // Hide the filter section and display the division/league section
    document.getElementById('filterSection').style.display = 'none';
    document.getElementById('divisionLeagueSection').style.display = 'block';
}

// Function show games
function showGames() {
    // Hide the standings section and display the games section
    document.getElementById('standings-section').style.display = 'none';
    document.getElementById('games-section').style.display = 'block';

    // Update the tab styles to reflect the current view
    document.getElementById('standings-tab').classList.remove('is-active');
    document.getElementById('games-tab').classList.add('is-active');

    // Display the filter section and hide the division/league section
    document.getElementById('filterSection').style.display = 'block';
    document.getElementById('divisionLeagueSection').style.display = 'none';

    // Call the function to display games
    displayGames();
}

// Function to delete local storage
function deleteLocalStorage() {
    // Confirm before deleting local storage data
    const confirmation = confirm("Are you sure you want to delete all data from local storage? This action cannot be undone.");

    if (confirmation) {
        // Clear the games array and remove the item from local storage
        games = [];
        localStorage.removeItem('games');

        // Update the display to reflect the deletion
        updateData();
        displayGames();

        alert("Local storage data has been deleted.");
    } else {
        // Alert the user that the data was not deleted
        alert("Local storage data was not deleted.");
    }
}

// Intial tab opening load
window.onload = function () {
    // Load games from local storage or initialize as an empty array
    games = JSON.parse(localStorage.getItem('games')) || [];

    // Hide the filter section initially
    document.getElementById('filterSection').style.display = 'none';

    // Update the data and display the games
    updateData();
    displayGames();
};

// Function for only showing certain divisions in table
function displayRows(filterType) {
    // Define the teams in each division
    const divisions = {
        'Atlantic': ['Toronto Raptors', 'Boston Celtics', 'New York Knicks', 'Brooklyn Nets', 'Philadelphia 76ers'],
        'Central': ['Chicago Bulls', 'Cleveland Cavaliers', 'Detroit Pistons', 'Indiana Pacers', 'Milwaukee Bucks'],
        'Southeast': ['Atlanta Hawks', 'Charlotte Hornets', 'Miami Heat', 'Orlando Magic', 'Washington Wizards'],
        'Northwest': ['Denver Nuggets', 'Minnesota Timberwolves', 'Oklahoma City Thunder', 'Portland Trail Blazers', 'Utah Jazz'],
        'Pacific': ['Golden State Warriors', 'Los Angeles Clippers', 'Los Angeles Lakers', 'Phoenix Suns', 'Sacramento Kings'],
        'Southwest': ['Dallas Mavericks', 'Houston Rockets', 'Memphis Grizzlies', 'New Orleans Pelicans', 'San Antonio Spurs']
    };

    // Get the table body element and all its row elements
    const tableBody = document.getElementById('statsTableBody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    // Iterate over each row to determine if it should be displayed
    rows.forEach(row => {
        const teamName = row.querySelector('td').textContent; // Extract the team name from the row
        let shouldDisplay = false; // Flag to determine whether the row should be displayed

        // Check if the row should be displayed based on the filter type
        if (filterType === 'All') {
            shouldDisplay = true; // Display all rows if the filter type is 'All'
        } else if (divisions[filterType] && divisions[filterType].includes(teamName)) {
            shouldDisplay = true; // Display the row if the team is in the selected division
        }

        // Set the display style of the row based on the shouldDisplay flag
        row.style.display = shouldDisplay ? '' : 'none';
    });
}

// Function to only display certain leadges 
function displayRowsL(filterType) {
    // Define the divisions in each league
    const leagues = {
        'Eastern': ['Atlantic', 'Central', 'Southeast'],
        'Western': ['Northwest', 'Pacific', 'Southwest']
    };

    // Define the teams in each division, same as in displayRows
    const divisions = {
        'Atlantic': ['Toronto Raptors', 'Boston Celtics', 'New York Knicks', 'Brooklyn Nets', 'Philadelphia 76ers'],
        'Central': ['Chicago Bulls', 'Cleveland Cavaliers', 'Detroit Pistons', 'Indiana Pacers', 'Milwaukee Bucks'],
        'Southeast': ['Atlanta Hawks', 'Charlotte Hornets', 'Miami Heat', 'Orlando Magic', 'Washington Wizards'],
        'Northwest': ['Denver Nuggets', 'Minnesota Timberwolves', 'Oklahoma City Thunder', 'Portland Trail Blazers', 'Utah Jazz'],
        'Pacific': ['Golden State Warriors', 'Los Angeles Clippers', 'Los Angeles Lakers', 'Phoenix Suns', 'Sacramento Kings'],
        'Southwest': ['Dallas Mavericks', 'Houston Rockets', 'Memphis Grizzlies', 'New Orleans Pelicans', 'San Antonio Spurs']
    };

    // Flatten the teams in the selected league into a single array
    const teamsInLeague = leagues[filterType].flatMap(division => divisions[division]);

    // Get the table body and all its row elements
    const tableBody = document.getElementById('statsTableBody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    // Iterate over each row to determine if it should be displayed
    rows.forEach(row => {
        const teamName = row.cells[0].textContent; // Extract the team name from the row
        const shouldDisplay = teamsInLeague.includes(teamName); // Determine if the team is in the selected league

        // Set the display style of the row based on whether the team is in the league
        row.style.display = shouldDisplay ? '' : 'none';
    });
}