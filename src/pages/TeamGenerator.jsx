
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, Users, TrendingUp } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import PlayerCard from '@/components/PlayerCard';
import { generateBalancedTeams } from '@/utils/teamGenerator';
import { toast } from '@/components/ui/use-toast';

const TeamGenerator = () => {
  const [players] = useLocalStorage('futsal-players', []);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [generatedTeams, setGeneratedTeams] = useState(null);

  const handlePlayerSelect = (player) => {
    setSelectedPlayers(prev => {
      const isSelected = prev.some(p => p.id === player.id);
      if (isSelected) {
        return prev.filter(p => p.id !== player.id);
      } else {
        return [...prev, player];
      }
    });
  };

  const handleGenerateTeams = () => {
    if (selectedPlayers.length < 8) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos 8 jogadores para gerar as equipas",
        variant: "destructive"
      });
      return;
    }

    try {
      const teams = generateBalancedTeams(selectedPlayers);
      setGeneratedTeams(teams);
      toast({
        title: "Sucesso",
        description: "Equipas geradas com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSelectAll = () => {
    if (selectedPlayers.length === players.length) {
      setSelectedPlayers([]);
    } else {
      setSelectedPlayers([...players]);
    }
  };

  const handleReset = () => {
    setGeneratedTeams(null);
    setSelectedPlayers([]);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-white">Gerador de Equipas</h1>
        <p className="text-gray-300">Selecione os jogadores e gere equipas equilibradas</p>
      </motion.div>

      {players.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Users className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Nenhum jogador cadastrado</h3>
          <p className="text-gray-300">Adicione jogadores primeiro para gerar equipas</p>
        </motion.div>
      ) : (
        <>
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-xl p-6"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={selectedPlayers.length === players.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <label htmlFor="select-all" className="text-white font-medium">
                    Selecionar Todos ({players.length})
                  </label>
                </div>
                <div className="text-gray-300">
                  {selectedPlayers.length} selecionados
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Limpar
                </Button>
                <Button
                  onClick={handleGenerateTeams}
                  disabled={selectedPlayers.length < 8}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Gerar Equipas
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Player Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Selecionar Jogadores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <PlayerCard
                    player={player}
                    onSelect={() => handlePlayerSelect(player)}
                    isSelected={selectedPlayers.some(p => p.id === player.id)}
                    showActions={false}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Generated Teams */}
          {generatedTeams && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white text-center">Equipas Geradas</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Team 1 */}
                <div className="team-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Equipa 1</h3>
                    <div className="flex items-center space-x-2 text-green-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-semibold">{generatedTeams.team1.averageRank}/10</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {generatedTeams.team1.players.map((player) => (
                      <PlayerCard
                        key={player.id}
                        player={player}
                        showActions={false}
                      />
                    ))}
                  </div>
                </div>

                {/* Team 2 */}
                <div className="team-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Equipa 2</h3>
                    <div className="flex items-center space-x-2 text-green-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-semibold">{generatedTeams.team2.averageRank}/10</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {generatedTeams.team2.players.map((player) => (
                      <PlayerCard
                        key={player.id}
                        player={player}
                        showActions={false}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default TeamGenerator;
