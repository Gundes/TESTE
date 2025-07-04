import React from 'react'; 
import { motion } from 'framer-motion'; 
import { Trophy, Calendar, TrendingUp, TrendingDown } from 'lucide-react'; 
import { useLocalStorage } from '@/hooks/useLocalStorage';

const History = () => {
  const [games] = useLocalStorage('futsal-games', []);
  const sortedGames = [...games].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <>
      {/* Header */}
      # Histórico de Partidas
      Acompanhe todos os jogos realizados

      {/* Games List */}
      {sortedGames.length === 0 ? (
        <>
          ### Nenhum jogo registado
          Os jogos aparecerão aqui após serem registados
        </>
      ) : (
        sortedGames.map((game, index) => (
          <div key={index}>
            {/* Game Header */}
            ### Jogo #{sortedGames.length - index}
            {new Date(game.date).toLocaleDateString('pt-BR')}
            Equipa {game.winnerTeam} Venceu ±{game.pointsChange} estrelas

            {/* Teams */}
            #### Equipa 1 {game.winnerTeam === 1 && <Trophy />}
            {game.team1.map((player) => (
              <p key={player.name}>{player.name} ({player.rank}⭐)</p>
            ))}

            #### Equipa 2 {game.winnerTeam === 2 && <Trophy />}
            {game.team2.map((player) => (
              <p key={player.name}>{player.name} ({player.rank}⭐)</p>
            ))}

            {/* Rank Changes */}
            #### Alterações de Ranking
            {game.rankChanges.map((change, i) => (
              <div key={i}>
                <span>{change.playerName}</span>
                <span>{change.oldRank} → {change.newRank}</span>
                {change.change.startsWith('+') ? <TrendingUp /> : <TrendingDown />}
                <span>{change.change}</span>
              </div>
            ))}
          </div>
        ))
      )}
    </>
  );
};

export default History;
