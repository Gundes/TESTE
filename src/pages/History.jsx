
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const History = () => {
  const [games] = useLocalStorage('futsal-games', []);

  const sortedGames = [...games].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-white">Histórico de Partidas</h1>
        <p className="text-gray-300">Acompanhe todos os jogos realizados</p>
      </motion.div>

      {/* Games List */}
      {sortedGames.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Trophy className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Nenhum jogo registado</h3>
          <p className="text-gray-300">Os jogos aparecerão aqui após serem registados</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {sortedGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="glass-effect rounded-xl p-6"
            >
              {/* Game Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Jogo #{sortedGames.length - index}
                    </h3>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(game.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">
                    Equipa {game.winnerTeam} Venceu
                  </p>
                  <p className="text-gray-300 text-sm">
                    ±{game.pointsChange} estrelas
                  </p>
                </div>
              </div>

              {/* Teams */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Team 1 */}
                <div className={`p-4 rounded-lg ${game.winnerTeam === 1 ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5'}`}>
                  <h4 className="font-semibold text-white mb-3 flex items-center">
                    Equipa 1
                    {game.winnerTeam === 1 && <Trophy className="w-4 h-4 ml-2 text-yellow-400" />}
                  </h4>
                  <div className="space-y-2">
                    {game.team1.map((player) => (
                      <div key={player.id} className="text-gray-300">
                        {player.name} ({player.rank}⭐)
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team 2 */}
                <div className={`p-4 rounded-lg ${game.winnerTeam === 2 ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5'}`}>
                  <h4 className="font-semibold text-white mb-3 flex items-center">
                    Equipa 2
                    {game.winnerTeam === 2 && <Trophy className="w-4 h-4 ml-2 text-yellow-400" />}
                  </h4>
                  <div className="space-y-2">
                    {game.team2.map((player) => (
                      <div key={player.id} className="text-gray-300">
                        {player.name} ({player.rank}⭐)
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rank Changes */}
              <div className="border-t border-white/10 pt-4">
                <h4 className="font-semibold text-white mb-3">Alterações de Ranking</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {game.rankChanges.map((change) => (
                    <div
                      key={change.playerId}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <span className="text-white">{change.playerName}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-300 text-sm">
                          {change.oldRank} → {change.newRank}
                        </span>
                        <span className={`flex items-center text-sm ${
                          change.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {change.change.startsWith('+') ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {change.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
