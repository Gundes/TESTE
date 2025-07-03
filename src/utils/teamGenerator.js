
export const generateBalancedTeams = (players) => {
  if (players.length < 8) {
    throw new Error('Mínimo de 8 jogadores necessário');
  }

  // Ordenar jogadores por ranking (do maior para o menor)
  const sortedPlayers = [...players].sort((a, b) => b.rank - a.rank);
  
  const team1 = [];
  const team2 = [];
  
  // Algoritmo de distribuição alternada para equilibrar as equipas
  sortedPlayers.forEach((player, index) => {
    if (index % 2 === 0) {
      team1.push(player);
    } else {
      team2.push(player);
    }
  });
  
  // Calcular força média das equipas
  const team1Strength = team1.reduce((sum, player) => sum + player.rank, 0) / team1.length;
  const team2Strength = team2.reduce((sum, player) => sum + player.rank, 0) / team2.length;
  
  return {
    team1: {
      players: team1,
      averageRank: Math.round(team1Strength * 10) / 10
    },
    team2: {
      players: team2,
      averageRank: Math.round(team2Strength * 10) / 10
    }
  };
};

export const updatePlayerRanks = (players, winningTeam, losingTeam, pointsChange = 0.5) => {
  const updatedPlayers = [...players];
  
  // Atualizar rankings dos vencedores
  winningTeam.forEach(player => {
    const playerIndex = updatedPlayers.findIndex(p => p.id === player.id);
    if (playerIndex !== -1) {
      updatedPlayers[playerIndex].rank = Math.min(10, updatedPlayers[playerIndex].rank + pointsChange);
    }
  });
  
  // Atualizar rankings dos perdedores
  losingTeam.forEach(player => {
    const playerIndex = updatedPlayers.findIndex(p => p.id === player.id);
    if (playerIndex !== -1) {
      updatedPlayers[playerIndex].rank = Math.max(1, updatedPlayers[playerIndex].rank - pointsChange);
    }
  });
  
  return updatedPlayers;
};
