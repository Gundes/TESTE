import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Shuffle, Trophy, History, TrendingUp, PiggyBank } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const [players] = useLocalStorage('futsal-players', []);
  const [games] = useLocalStorage('futsal-games', []);

  const stats = {
    totalPlayers: players.length,
    totalGames: games.length,
    averageRank: players.length > 0 ? (players.reduce((sum, p) => sum + p.rank, 0) / players.length).toFixed(1) : 0,
    topPlayer: players.length > 0 ? players.reduce((prev, current) => (prev.rank > current.rank) ? prev : current) : null
  };

  const quickActions = [
    {
      title: 'Gerir Jogadores',
      description: 'Adicionar, editar ou remover jogadores',
      icon: Users,
      link: '/players',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Gerar Equipas',
      description: 'Criar equipas equilibradas para o próximo jogo',
      icon: Shuffle,
      link: '/team-generator',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Registar Resultado',
      description: 'Inserir resultado do último jogo',
      icon: Trophy,
      link: '/game-result',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Ver Histórico',
      description: 'Consultar jogos anteriores',
      icon: History,
      link: '/history',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Cofrinho',
      description: 'Gerir o dinheiro das multas',
      icon: PiggyBank,
      link: '/piggy-bank',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold gradient-text">Dashboard Futsal</h1>
        <p className="text-gray-300 text-lg">Gerencie suas equipas e acompanhe estatísticas</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-xl p-6 text-center"
        >
          <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-white">{stats.totalPlayers}</h3>
          <p className="text-gray-300">Jogadores</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-xl p-6 text-center"
        >
          <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-white">{stats.totalGames}</h3>
          <p className="text-gray-300">Jogos</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-xl p-6 text-center"
        >
          <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-white">{stats.averageRank}</h3>
          <p className="text-gray-300">Rank Médio</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-xl p-6 text-center"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="text-white font-bold">👑</span>
          </div>
          <h3 className="text-lg font-bold text-white truncate">
            {stats.topPlayer ? stats.topPlayer.name : 'N/A'}
          </h3>
          <p className="text-gray-300">Melhor Jogador</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link to={action.link}>
                  <div className="glass-effect rounded-xl p-6 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-gray-300 text-sm">{action.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      {games.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Atividade Recente</h2>
          <div className="glass-effect rounded-xl p-6">
            <div className="space-y-4">
              {games.slice(-3).reverse().map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">
                      Jogo em {new Date(game.date).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-gray-300 text-sm">
                      Equipa {game.winnerTeam} venceu
                    </p>
                  </div>
                  <Trophy className="w-5 h-5 text-yellow-400" />
                </motion.div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link to="/history">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Ver Histórico Completo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;