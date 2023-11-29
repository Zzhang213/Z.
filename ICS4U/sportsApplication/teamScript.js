// Function to show team stats 
function updateTeamStats() {
    // Get the selected team from the dropdown
    const selectedTeam = document.getElementById('teamSelect').value;
    const teamStatsContainer = document.getElementById('teamStatsContainer');

    // Check if a team is selected
    if (!selectedTeam) {
        teamStatsContainer.innerHTML = '<p>Please select a team to view statistics.</p>';
        return;
    }

    // Filter the games array to get games where the selected team played
    const teamGames = games.filter(game => game.homeTeam === selectedTeam || game.awayTeam === selectedTeam);

    // Initialize variables to track statistics
    let wins = 0, homeWins = 0, roadWins = 0, losses = 0, homeLosses = 0, roadLosses = 0;
    let currentStreak = 0, winStreak = 0, lossStreak = 0, lastResult = '';

    // Loop through the team's games and calculate statistics
    teamGames.forEach(game => {
        const isHomeGame = game.homeTeam === selectedTeam;
        const didWin = (isHomeGame && game.scoreHome > game.awayScore) || (!isHomeGame && game.awayScore > game.scoreHome);

        if (didWin) {
            wins++;
            isHomeGame ? homeWins++ : roadWins++;
            if (lastResult === 'win') currentStreak++; else currentStreak = 1;
            winStreak = Math.max(winStreak, currentStreak);
        } else {
            losses++;
            isHomeGame ? homeLosses++ : roadLosses++;
            if (lastResult === 'loss') currentStreak++; else currentStreak = 1;
            lossStreak = Math.max(lossStreak, currentStreak);
        }

        lastResult = didWin ? 'win' : 'loss';
    });

    // Calculate win rate
    const winRate = (wins + losses) > 0 ? Math.floor((wins / (wins + losses)) * 100) : 0;

    // Determine the streak (W or L)
    const streak = lastResult === 'win' ? `W${winStreak}` : `L${lossStreak}`;

    // Update the teamStatsContainer with the statistics
    teamStatsContainer.innerHTML = `
    <div class="content" style="margin-top: 20px;">
        <h2 class="title">${selectedTeam} - 2022 NBA Season</h2>
        <div class="level">
            <div class="level-item has-text-centered">
                <img src="Image/pngimg.com - nba_PNG8.png" alt="NBA Logo" style="width: 70px;">
            </div>
            <div class="level-item has-text-centered">
                <p><strong>Wins:</strong> ${wins}</p>
            </div>
            <div class="level-item has-text-centered">
                <p><strong>Losses:</strong> ${losses}</p>
            </div>
            <div class="level-item has-text-centered">
                <p><strong>Win Rate:</strong> ${winRate}%</p>
            </div>
            <div class="level-item has-text-centered">
                <p><strong>Home:</strong> ${homeWins} - ${homeLosses}</p>
            </div>
            <div class="level-item has-text-centered">
                <p><strong>Road:</strong> ${roadWins} - ${roadLosses}</p>
            </div>
            <div class="level-item has-text-centered">
                <p><strong>Streak:</strong> ${streak}</p>
            </div>
        </div>
    </div>
    `;

    // Call the displayTeamGames function to show the team's games
    displayTeamGames(selectedTeam);
}

// FUnction to show all games 
function displayTeamGames(teamName) {
    const teamGamesContainer = document.getElementById('teamGamesContainer');
    teamGamesContainer.innerHTML = '<div class="columns is-multiline">';

    // Filter the games to get games where the selected team played
    const teamGames = games.filter(game => game.homeTeam === teamName || game.awayTeam === teamName)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Check if there are no games for the selected team
    if (teamGames.length === 0) {
        teamGamesContainer.innerHTML = '<p>No games found for this team.</p>';
        return;
    }

    // Helper function to get the last word of a team name
    const getLastWord = team => {
        const words = team.split(' ');
        return words[words.length - 1];
    };

    // Loop through the team's games and create game cards for each
    teamGames.forEach(game => {
        const column = document.createElement('div');
        column.className = 'column is-one-third';

        const gameCard = document.createElement('div');
        gameCard.className = 'card';

        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';

        const content = document.createElement('div');
        content.className = 'content';
        content.innerHTML = `
            <p><strong>Date:</strong> ${new Date(game.date).toLocaleDateString()}</p>
            <p><strong>Matchup:</strong> ${getLastWord(game.homeTeam)} vs ${getLastWord(game.awayTeam)}</p>
            <p><strong>Score:</strong> ${game.scoreHome} - ${game.awayScore}</p>
        `;

        cardContent.appendChild(content);
        gameCard.appendChild(cardContent);
        column.appendChild(gameCard);
        teamGamesContainer.children[0].appendChild(column);
    });

    teamGamesContainer.innerHTML += '</div>';
}

//Function to update team stats
function updateTeamStats(teamNameFromURL = null) {
    // Get the team name from the URL parameter, if not provided, from the team select dropdown
    const teamName = teamNameFromURL || getURLParameter('team') || document.getElementById('teamSelect').value;
    const teamStatsContainer = document.getElementById('teamStatsContainer');

    if (!teamName) {
        teamStatsContainer.innerHTML = '<p>Please select a team to view statistics.</p>';
        return;
    }

    // Filter the games to get games where the selected team played
    const teamGames = games.filter(game => game.homeTeam === teamName || game.awayTeam === teamName);

    let wins = 0, homeWins = 0, roadWins = 0, losses = 0, homeLosses = 0, roadLosses = 0;
    let currentStreak = 0, winStreak = 0, lossStreak = 0, lastResult = '';

    // Calculate statistics based on the team's games
    teamGames.forEach(game => {
        const isHomeGame = game.homeTeam === teamName;
        const didWin = (isHomeGame && game.scoreHome > game.awayScore) || (!isHomeGame && game.awayScore > game.scoreHome);

        if (didWin) {
            wins++;
            isHomeGame ? homeWins++ : roadWins++;
            if (lastResult === 'win') currentStreak++; else currentStreak = 1;
            winStreak = Math.max(winStreak, currentStreak);
        } else {
            losses++;
            isHomeGame ? homeLosses++ : roadLosses++;
            if (lastResult === 'loss') currentStreak++; else currentStreak = 1;
            lossStreak = Math.max(lossStreak, currentStreak);
        }

        lastResult = didWin ? 'win' : 'loss';
    });

    // Calculate win rate
    const winRate = (wins + losses) > 0 ? Math.floor((wins / (wins + losses)) * 100) : 0;
    // Determine the current streak (winning or losing)
    const streak = lastResult === 'win' ? `W${winStreak}` : `L${lossStreak}`;

    // Display the team's statistics in the teamStatsContainer
    teamStatsContainer.innerHTML = `
        <div class="content" style="margin-top: 20px;">
            <h2 class="title">${teamName} - 2022 NBA Season</h2>
            <div class="level">
                <div class="level-item has-text-centered">
                    <img src="Image/pngimg.com - nba_PNG8.png" alt="NBA Logo" style="width: 70px;">
                </div>
                <div class="level-item has-text-centered">
                    <p><strong>Wins:</strong> ${wins}</p>
                </div>
                <div class="level-item has-text-centered">
                    <p><strong>Losses:</strong> ${losses}</p>
                </div>
                <div class="level-item has-text-centered">
                    <p><strong>Win Rate:</strong> ${winRate}%</p>
                </div>
                <div class="level-item has-text-centered">
                    <p><strong>Home:</strong> ${homeWins} - ${homeLosses}</p>
                </div>
                <div class="level-item has-text-centered">
                    <p><strong>Road:</strong> ${roadWins} - ${roadLosses}</p>
                </div>
                <div class="level-item has-text-centered">
                    <p><strong>Streak:</strong> ${streak}</p>
                </div>
            </div>
        </div>
    `;

    // Display the team's games
    displayTeamGames(teamName);
}

// Very short function 
document.addEventListener('DOMContentLoaded', function () {
    updateTeamStats();
});

//another very short function 
function getURLParameter(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}










