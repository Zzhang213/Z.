let games = JSON.parse(localStorage.getItem('games')) || [];
if (games.length === 0) {
    for (let i = 0; i < 100; i++) {
        games.push(generateGame(i + 1));
    }
    localStorage.setItem('games', JSON.stringify(games));
}
let currentPage = 1;
const gamesPerPage = 9;

function generateGame(id) {
    const teams = ["Toronto Raptors", "Boston Celtics", "Philadelphia 76ers", "Brooklyn Nets", "New York Knicks",
        "Milwaukee Bucks", "Indiana Pacers", "Chicago Bulls", "Detroit Pistons", "Cleveland Cavaliers",
        "Miami Heat", "Orlando Magic", "Charlotte Hornets", "Washington Wizards", "Atlanta Hawks",
        "Denver Nuggets", "Oklahoma City Thunder", "Utah Jazz", "Portland Trail Blazers", "Minnesota Timberwolves",
        "Los Angeles Lakers", "Los Angeles Clippers", "Phoenix Suns", "Sacramento Kings", "Golden State Warriors",
        "Houston Rockets", "Dallas Mavericks", "Memphis Grizzlies", "San Antonio Spurs", "New Orleans Pelicans"];

    const homeTeam = teams[Math.floor(Math.random() * teams.length)];
    let awayTeam;
    do {
        awayTeam = teams[Math.floor(Math.random() * teams.length)];
    } while (awayTeam === homeTeam);

    const scoreHome = Math.floor(Math.random() * 100) + 50;
    const scoreAway = Math.floor(Math.random() * 100) + 50;

    const startDate = new Date(2022, 9, 18);
    const endDate = new Date(2023, 3, 9);
    const timeDiff = endDate - startDate;
    const randomDate = new Date(startDate.getTime() + Math.random() * timeDiff);

    return {
        id: id,
        date: randomDate.toISOString().split('T')[0],
        homeTeam: homeTeam,
        scoreHome: scoreHome,
        awayTeam: awayTeam,
        awayScore: scoreAway
    };
}

function addGame() {
    const dateInput = document.getElementById('date').value;
    const homeTeam = document.getElementById('homeTeam').value;
    const scoreHome = document.getElementById('scoreHome').value;
    const awayTeam = document.getElementById('awayTeam').value;
    const awayScore = document.getElementById('awayScore').value;

    if (!dateInput || !homeTeam || !scoreHome || !awayTeam || !awayScore) {
        alert("Please fill in all fields.");
        return;
    }

    if (homeTeam === "Team Name" || awayTeam === "Team Name") {
        alert("Please select both teams.");
        return;
    }

    const date = new Date(dateInput);
    const startDate = new Date("2022-10-18");
    const endDate = new Date("2023-04-09");
    if (date < startDate || date > endDate) {
        alert("Please select a date between October 18, 2022, and April 9, 2023.");
        return;
    }

    const game = {
        date: date.toISOString(),
        homeTeam: homeTeam,
        scoreHome: scoreHome,
        awayTeam: awayTeam,
        awayScore: awayScore
    };

    games.push(game);

    localStorage.setItem('games', JSON.stringify(games));

    updateData();
    displayGames();

    document.getElementById('date').value = '';
    document.getElementById('homeTeam').value = '';
    document.getElementById('scoreHome').value = '';
    document.getElementById('awayTeam').value = '';
    document.getElementById('awayScore').value = '';
}

function updateData() {
    const stats = {};

    games.forEach(game => {
        const homeTeam = game.homeTeam;
        const awayTeam = game.awayTeam;
        const homeScore = parseInt(game.scoreHome);
        const awayScore = parseInt(game.awayScore);

        if (!stats[homeTeam]) initTeamStats(stats, homeTeam);
        if (!stats[awayTeam]) initTeamStats(stats, awayTeam);

        if (homeScore > awayScore) {
            updateTeamStats(stats, homeTeam, 'win', 'home');
            updateTeamStats(stats, awayTeam, 'loss', 'road');
        } else {
            updateTeamStats(stats, awayTeam, 'win', 'road');
            updateTeamStats(stats, homeTeam, 'loss', 'home');
        }
    });

    displayStats(stats);
}

function initTeamStats(stats, team) {
    stats[team] = { wins: 0, losses: 0, homeWins: 0, homeLosses: 0, roadWins: 0, roadLosses: 0, winStreak: 0, lossStreak: 0, currentWinStreak: 0, currentLossStreak: 0 };
}

function updateTeamStats(stats, team, result, location) {
    const teamStats = stats[team];
    if (result === 'win') {
        teamStats.wins++;
        teamStats.currentWinStreak++;
        teamStats.currentLossStreak = 0;
        if (teamStats.currentWinStreak > teamStats.winStreak) teamStats.winStreak = teamStats.currentWinStreak;
        if (location === 'home') teamStats.homeWins++;
        else teamStats.roadWins++;
    } else {
        teamStats.losses++;
        teamStats.currentLossStreak++;
        teamStats.currentWinStreak = 0;
        if (teamStats.currentLossStreak > teamStats.lossStreak) teamStats.lossStreak = teamStats.currentLossStreak;
        if (location === 'home') teamStats.homeLosses++;
        else teamStats.roadLosses++;
    }
}

function displayStats(stats) {
    const tableBody = document.getElementById('statsTableBody');
    tableBody.innerHTML = '';

    for (const team in stats) {
        const teamStats = stats[team];
        const winRate = teamStats.wins + teamStats.losses > 0 ? Math.floor((teamStats.wins / (teamStats.wins + teamStats.losses)) * 100) : 0;
        const homeRecord = `${teamStats.homeWins} - ${teamStats.homeLosses}`;
        const roadRecord = `${teamStats.roadWins} - ${teamStats.roadLosses}`;
        const streak = teamStats.winStreak >= teamStats.lossStreak ? `W${teamStats.winStreak}` : `L${teamStats.lossStreak}`;

        const row = `<tr>
            <td><a href="team.html?team=${encodeURIComponent(team)}">${team}</a></td>
            <td>${teamStats.wins}</td>
            <td>${teamStats.losses}</td>
            <td>${winRate}%</td>
            <td>${homeRecord}</td>
            <td>${roadRecord}</td>
            <td>${streak}</td>
        </tr>`;

        tableBody.innerHTML += row;
    }
}

function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'card game-card';
    card.style.width = '340px'; // Consider setting this in CSS instead

    const header = document.createElement('header');
    header.className = 'card-header';
    header.textContent = `Game Date: ${new Date(game.date).toLocaleDateString()}`;
    header.style.padding = '20px';
    header.style.textAlign = 'center';

    const content = document.createElement('div');
    content.className = 'card-content';

    const contentInner = document.createElement('div');
    contentInner.className = 'content';

    // Extract the last word of the team names
    const homeTeamLastName = game.homeTeam.split(' ').pop();
    const awayTeamLastName = game.awayTeam.split(' ').pop();

    contentInner.innerHTML = `
        ${homeTeamLastName} vs ${awayTeamLastName}
        <br>
        Score: ${game.scoreHome} - ${game.awayScore}
    `;

    card.appendChild(header);
    card.appendChild(content);
    content.appendChild(contentInner);

    return card;
}




function displayGames(page = 1) {
    currentPage = page;
    const gamesContainer = document.getElementById('gamesContainer');
    gamesContainer.innerHTML = '';

    const currentGames = filteredGames.length > 0 ? filteredGames : games;
    const sortedGames = currentGames.sort((a, b) => new Date(b.date) - new Date(a.date));
    const startIndex = (page - 1) * gamesPerPage;
    const selectedGames = sortedGames.slice(startIndex, startIndex + gamesPerPage);

    selectedGames.forEach(game => {
        const gameCard = createGameCard(game);
        gamesContainer.appendChild(gameCard);
    });

    displayPaginationControls();
}


function displayPaginationControls() {
    const paginationContainer = document.getElementById('paginationContainer');
    const totalGames = filteredGames.length > 0 ? filteredGames.length : games.length;
    const totalPages = Math.ceil(totalGames / gamesPerPage);


    paginationContainer.innerHTML = '';


    const paginationWrapper = document.createElement('nav');
    paginationWrapper.className = 'pagination is-centered';
    paginationWrapper.setAttribute('role', 'navigation');
    paginationWrapper.setAttribute('aria-label', 'pagination');


    const paginationList = document.createElement('ul');
    paginationList.className = 'pagination-list';

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li');
        const pageLink = document.createElement('a');
        pageLink.className = 'pagination-link';
        pageLink.textContent = i;


        if (i === currentPage) {
            pageLink.classList.add('is-current');
        }

        pageLink.addEventListener('click', () => displayGames(i));
        pageItem.appendChild(pageLink);
        paginationList.appendChild(pageItem);
    }

    paginationWrapper.appendChild(paginationList);
    paginationContainer.appendChild(paginationWrapper);
}

function showStandings() {
    document.getElementById('standings-section').style.display = 'block';
    document.getElementById('games-section').style.display = 'none';
    document.getElementById('standings-tab').classList.add('is-active');
    document.getElementById('games-tab').classList.remove('is-active');
    document.getElementById('filterSection').style.display = 'none';
    document.getElementById('divisionLeagueSection').style.display = 'block';
}

function showGames() {
    document.getElementById('standings-section').style.display = 'none';
    document.getElementById('games-section').style.display = 'block';
    document.getElementById('standings-tab').classList.remove('is-active');
    document.getElementById('games-tab').classList.add('is-active');
    document.getElementById('filterSection').style.display = 'block';
    document.getElementById('divisionLeagueSection').style.display = 'none';
    displayGames();
}

function deleteLocalStorage() {
    const confirmation = confirm("Are you sure you want to delete all data from local storage? This action cannot be undone.");

    if (confirmation) {
        games = [];
        localStorage.removeItem('games');
        updateData();
        displayGames();
        alert("Local storage data has been deleted.");
    } else {
        alert("Local storage data was not deleted.");
    }
}

window.onload = function () {
    games = JSON.parse(localStorage.getItem('games')) || [];
    document.getElementById('filterSection').style.display = 'none';
    updateData();
    displayGames();
};

function displayRows(filterType) {

    const divisions = {
        'Atlantic': ['Toronto Raptors', 'Boston Celtics', 'New York Knicks', 'Brooklyn Nets', 'Philadelphia 76ers'],
        'Central': ['Chicago Bulls', 'Cleveland Cavaliers', 'Detroit Pistons', 'Indiana Pacers', 'Milwaukee Bucks'],
        'Southeast': ['Atlanta Hawks', 'Charlotte Hornets', 'Miami Heat', 'Orlando Magic', 'Washington Wizards'],
        'Northwest': ['Denver Nuggets', 'Minnesota Timberwolves', 'Oklahoma City Thunder', 'Portland Trail Blazers', 'Utah Jazz'],
        'Pacific': ['Golden State Warriors', 'Los Angeles Clippers', 'Los Angeles Lakers', 'Phoenix Suns', 'Sacramento Kings'],
        'Southwest': ['Dallas Mavericks', 'Houston Rockets', 'Memphis Grizzlies', 'New Orleans Pelicans', 'San Antonio Spurs']
    };

    const tableBody = document.getElementById('statsTableBody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.forEach(row => {
        const teamName = row.querySelector('td').textContent;
        let shouldDisplay = false;

        if (filterType === 'All') {
            shouldDisplay = true;
        } else if (divisions[filterType] && divisions[filterType].includes(teamName)) {
            shouldDisplay = true;
        }

        row.style.display = shouldDisplay ? '' : 'none';
    });
}

function displayRowsL(filterType) {

    const leagues = {
        'Eastern': ['Atlantic', 'Central', 'Southeast'],
        'Western': ['Northwest', 'Pacific', 'Southwest']
    };


    const divisions = {
        'Atlantic': ['Toronto Raptors', 'Boston Celtics', 'New York Knicks', 'Brooklyn Nets', 'Philadelphia 76ers'],
        'Central': ['Chicago Bulls', 'Cleveland Cavaliers', 'Detroit Pistons', 'Indiana Pacers', 'Milwaukee Bucks'],
        'Southeast': ['Atlanta Hawks', 'Charlotte Hornets', 'Miami Heat', 'Orlando Magic', 'Washington Wizards'],
        'Northwest': ['Denver Nuggets', 'Minnesota Timberwolves', 'Oklahoma City Thunder', 'Portland Trail Blazers', 'Utah Jazz'],
        'Pacific': ['Golden State Warriors', 'Los Angeles Clippers', 'Los Angeles Lakers', 'Phoenix Suns', 'Sacramento Kings'],
        'Southwest': ['Dallas Mavericks', 'Houston Rockets', 'Memphis Grizzlies', 'New Orleans Pelicans', 'San Antonio Spurs']
    };


    const teamsInLeague = leagues[filterType].flatMap(division => divisions[division]);

    const tableBody = document.getElementById('statsTableBody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.forEach(row => {
        const teamName = row.cells[0].textContent;
        const shouldDisplay = teamsInLeague.includes(teamName);
        row.style.display = shouldDisplay ? '' : 'none';
    });
}






