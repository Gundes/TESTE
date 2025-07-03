
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Save, Settings } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import PlayerCard from '@/components/PlayerCard';
import { updatePlayerRanks } from '@/utils/teamGenerator';
import { toast } from '@/components/ui/use-toast';

const GameResult = () => {
  const [players, setPlayers] = useLocalStorage('futsal-players', []);
  const [games, setGames] = useLocalStorage('futsal-games', []);
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const [winner, setWinner] = useState(null);
  const [pointsChange, setPointsChange] = useState([0.5]);

  const availablePlayers = players.filter(
    player => !team1.some(p => p.id === player.id) && !team2.some(p => p.id === player.id)
  );

  const handlePlayerToTeam = (player, teamNumber) => {
    if (teamNumber === 1) {
      setTeam1([...team1, player]);
    } else {
      setTeam2([...team2, player]);
    }
  };

  const handleRemoveFromTeam = (playerId, teamNumber) => {
    if (teamNumber === 1) {
      setTeam1(team1.filter(p => p.id !== playerId));
    } else {
      setTeam2(team2.filter(p => p.id !== playerId));
    }
  };

  const handleSaveResult = () => {
    if (team1.length === 0 || team2.length === 0) {
      toast({
        title: "Erro",
        description: "Ambas as equipas devem ter pelo menos um jogador",
        variant: "destructive"
      });
      return;
    }

    if (!winner) {
      toast({
        title: "Erro",
        description: "Selecione a equipa vencedora",
        variant: "destructive"
      });
      return;
    }

    const winningTeam = winner === 1 ? team1 : team2;
    const losingTeam = winner === 1 ? team2 : team1;

    // Atualizar rankings dos jogadores
    const updatedPlayers = updatePlayerRanks(players, winningTeam, losingTeam, pointsChange[0]);
    setPlayers(updatedPlayers);

    // Salvar jogo no histórico
    const newGame = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      team1: team1,
      team2: team2,
      winnerTeam: winner,
      pointsChange: pointsChange[0],
      rankChanges: [
        ...winningTeam.map(player => ({
          playerId: player.id,
          playerName: player.name,
          oldRank: player.rank,
          newRank: Math.min(10, player.rank + pointsChange[0]),
          change: `+${pointsChange[0]}`
        })),
        ...losingTeam.map(player => ({
          playerId: player.id,
          playerName: player.name,
          oldRank: player.rank,
          newRank: Math.max(1, player.rank - pointsChange[0]),
          change: `-${pointsChange[0]}`
        }))
      ]
    };

    setGames([...games, newGame]);

    // Reset form
    setTeam1([]);
    setTeam2([]);
    setWinner(null);

    toast({
      title: "Sucesso",
      description: "Resultado salvo e rankings atualizados!"
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-white">Registar Resultado</h1>
        <p className="text-gray-300">Insira o resultado do jogo e atualize os rankings</p>
      </motion.div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-effect rounded-xl p-6"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-5 h-5 text-green-400" />
          <h2 className="text-lg font-semibold text-white">Configurações</h2>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="text-white mb-2 block">
              Alteração de Pontos: {pointsChange[0]} estrelas
            </Label>
            <Slider
              value={pointsChange}
              onValueChange={setPointsChange}
              max={1}
              min={0.1}
              step={0.1}
              className="w-full"
            />
            <p className="text-gray-400 text-sm mt-1">
              Vencedores ganham +{pointsChange[0]} estrelas, perdedores perdem -{pointsChange[0]} estrelas
            </p>
          </div>
        </div>
      </motion.div>

      {/* Available Players */}
      {availablePlayers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-bold text-white">Jogadores Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePlayers.map((player) => (
              <div key={player.id} className="space-y-2">
                <PlayerCard player={player} showActions={false} />
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handlePlayerToTeam(player, 1)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                  >
                    Equipa 1
                  </Button>
                  <Button
                    onClick={() => handlePlayerToTeam(player, 2)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/20"
                  >
                    Equipa 2
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Teams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Team 1 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="team-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Equipa 1</h3>
            <Button
              onClick={() => setWinner(1)}
              variant={winner === 1 ? "default" : "outline"}
              className={winner === 1 ? "bg-green-600 hover:bg-green-700" : "border-white/20 text-white hover:bg-white/10"}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Vencedora
            </Button>
          </div>
          <div className="space-y-3">
            {team1.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Nenhum jogador adicionado</p>
            ) : (
              team1.map((player) => (
                <div key={player.id} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <PlayerCard player={player} showActions={false} />
                  </div>
                  <Button
                    onClick={() => handleRemoveFromTeam(player.id, 1)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:bg-red-500/20"
                  >
                    Remover
                  </Button>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Team 2 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="team-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Equipa 2</h3>
            <Button
              onClick={() => setWinner(2)}
              variant={winner === 2 ? "default" : "outline"}
              className={winner === 2 ? "bg-green-600 hover:bg-green-700" : "border-white/20 text-white hover:bg-white/10"}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Vencedora
            </Button>
          </div>
          <div className="space-y-3">
            {team2.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Nenhum jogador adicionado</p>
            ) : (
              team2.map((player) => (
                <div key={player.id} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <PlayerCard player={player} showActions={false} />
                  </div>
                  <Button
                    onClick={() => handleRemoveFromTeam(player.id, 2)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:bg-red-500/20"
                  >
                    Remover
                  </Button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <Button
          onClick={handleSaveResult}
          disabled={team1.length === 0 || team2.length === 0 || !winner}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
        >
          <Save className="w-5 h-5 mr-2" />
          Salvar Resultado
        </Button>
      </motion.div>
    </div>
  );
};

export default GameResult;
