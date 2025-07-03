
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PlayerCard from '@/components/PlayerCard';
import PlayerForm from '@/components/PlayerForm';
import { toast } from '@/components/ui/use-toast';

const Players = () => {
  const [players, setPlayers] = useLocalStorage('futsal-players', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSavePlayer = (playerData) => {
    if (editingPlayer) {
      setPlayers(players.map(p => p.id === editingPlayer.id ? playerData : p));
    } else {
      setPlayers([...players, playerData]);
    }
    setEditingPlayer(null);
  };

  const handleEditPlayer = (player) => {
    setEditingPlayer(player);
    setIsFormOpen(true);
  };

  const handleDeletePlayer = (playerId) => {
    setPlayers(players.filter(p => p.id !== playerId));
    toast({
      title: "Sucesso",
      description: "Jogador removido com sucesso!"
    });
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPlayer(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Gestão de Jogadores</h1>
          <p className="text-gray-300">Gerencie sua equipa de futsal</p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Jogador
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Pesquisar jogadores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
        />
      </motion.div>

      {/* Players Grid */}
      <div className="space-y-4">
        {filteredPlayers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Plus className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm ? 'Nenhum jogador encontrado' : 'Nenhum jogador cadastrado'}
            </h3>
            <p className="text-gray-300 mb-6">
              {searchTerm ? 'Tente pesquisar com outros termos' : 'Comece adicionando seu primeiro jogador'}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Jogador
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <PlayerCard
                  player={player}
                  onEdit={handleEditPlayer}
                  onDelete={handleDeletePlayer}
                  showActions={true}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Player Form Modal */}
      <PlayerForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSavePlayer}
        player={editingPlayer}
      />
    </div>
  );
};

export default Players;
