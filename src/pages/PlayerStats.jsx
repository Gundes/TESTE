
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, TrendingUp, User, Calendar } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/StarRating';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PlayerStats = () => {
  const { id } = useParams();
  const [players] = useLocalStorage('futsal-players', []);
  const [games] = useLocalStorage('futsal-games', []);

  const player = players.find(p => p.id === id);

  if (!player) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Jogador não encontrado</h2>
        <Link to="/players">
          <Button className="bg-green-600 hover:bg-green-700">
            Voltar aos Jogadores
          </Button>
        </Link>
      </div>
    );
  }

  // Calcular estatísticas do jogador
  const playerGames = games.filter(game => 
    game.team1.some(p => p.id === id) || game.team2.some(p => p.id === id)
  );

  const wins = playerGames.filter(game => {
    const isInTeam1 = game.team1.some(p => p.id === id);
    return (isInTeam1 && game.winnerTeam === 1) || (!isInTeam1 && game.winnerTeam === 2);
  }).length;

  const losses = playerGames.length - wins;
  const winRate = playerGames.length > 0 ? ((wins / playerGames.length) * 100).toFixed(1) : 0;

  // Dados para o gráfico de evolução do ranking
  const rankEvolution = [];
  let currentRank = 5; // Ranking inicial padrão

  // Adicionar ponto inicial
  rankEvolution.push({
    game: 0,
    rank: currentRank,
    date: 'Início'
  });

  // Processar jogos em ordem cronológica
  const sortedGames = [...playerGames].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  sortedGames.forEach((game, index) => {
    const rankChange = game.rankChanges.find(change => change.playerId === id);
    if (rankChange) {
      currentRank = rankChange.newRank;
      rankEvolution.push({
        game: index + 1,
        rank: currentRank,
        date: new Date(game.date).toLocaleDateString('pt-BR')
      });
    }
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4"
      >
        <Link to="/players">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
            {player.image ? (
              <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{player.name}</h1>
            <StarRating rating={player.rank} readonly />
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-xl p-6 text-center"
        >
          <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-white">{playerGames.length}</h3>
          <p className="text-gray-300">Jogos</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-xl p-6 text-center"
        >
          <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-white">{wins}</h3>
          <p className="text-gray-300">Vitórias</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-xl p-6 text-center"
        >
          <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{losses}</h3>
          <p className="text-gray-300">Derrotas</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-xl p-6 text-center"
        >
          <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-white">{winRate}%</h3>
          <p className="text-gray-300">Taxa de Vitória</p>
        </motion.div>
      </div>

      {/* Rank Evolution Chart */}
      {rankEvolution.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-effect rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Evolução do Ranking</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rankEvolution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="game" 
                  stroke="#9CA3AF"
                  label={{ value: 'Jogos', position: 'insideBottom', offset: -5, style: { fill: '#9CA3AF' } }}
                />
                <YAxis 
                  domain={[1, 10]}
                  stroke="#9CA3AF"
                  label={{ value: 'Ranking', angle: -90, position: 'insideLeft', style: { fill: '#9CA3AF' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  labelFormatter={(value) => `Jogo ${value}`}
                  formatter={(value, name) => [value, 'Ranking']}
                />
                <Line 
                  type="monotone" 
                  dataKey="rank" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Recent Games */}
      {playerGames.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-effect rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Jogos Recentes</h2>
          <div className="space-y-4">
            {[...playerGames].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map((game) => {
              const isInTeam1 = game.team1.some(p => p.id === id);
              const won = (isInTeam1 && game.winnerTeam === 1) || (!isInTeam1 && game.winnerTeam === 2);
              const rankChange = game.rankChanges.find(change => change.playerId === id);
              
              return (
                <div
                  key={game.id}
                  className={`p-4 rounded-lg border ${
                    won 
                      ? 'bg-green-500/20 border-green-500/30' 
                      : 'bg-red-500/20 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">
                        {new Date(game.date).toLocaleDateString('pt-BR')}
                      </p>
                      <p className={`text-sm ${won ? 'text-green-400' : 'text-red-400'}`}>
                        {won ? 'Vitória' : 'Derrota'} - Equipa {isInTeam1 ? '1' : '2'}
                      </p>
                    </div>
                    {rankChange && (
                      <div className="text-right">
                        <p className="text-gray-300 text-sm">
                          {rankChange.oldRank} → {rankChange.newRank}
                        </p>
                        <p className={`text-sm ${
                          rankChange.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {rankChange.change}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PlayerStats;
