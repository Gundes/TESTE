import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const History = () => {
  const [games] = useLocalStorage('futsal-games', []);
  const sortedGames = [...games].sort((a, b) => new Date(b.date) - new Date(a.date));

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fineValue, setFineValue] = useState('');

  const openModal = (player) => {
    setSelectedPlayer(player);
    setFineValue('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlayer(null);
    setFineValue('');
  };

  const handleConfirmPayment = () => {
    console.log(`Pagamento confirmado para ${selectedPlayer.name} com multa de R$ ${fineValue || '0'}`);
    closeModal();
  };

  return (
    <>
      <h1>Histórico de Partidas</h1>
      <p>Acompanhe todos os jogos realizados</p>

      {sortedGames.length === 0 ? (
        <>
          <h3>Nenhum jogo registado</h3>
          <p>Os jogos aparecerão aqui após serem registados</p>
        </>
      ) : (
        sortedGames.map((game, index) => (
          <div key={index} className="game-card">
            <h3>Jogo #{sortedGames.length - index}</h3>
            <p>{new Date(game.date).toLocaleDateString('pt-BR')}</p>
            <p>Equipa {game.winnerTeam} Venceu ±{game.pointsChange} estrelas</p>

            <h4>Equipa 1 {game.winnerTeam === 1 && <Trophy />}</h4>
            {game.team1.map((player) => (
              <div key={player.name}>
                <span>{player.name} ({player.rank}⭐)</span>
                <button onClick={() => openModal(player)}>Pagar</button>
              </div>
            ))}

            <h4>Equipa 2 {game.winnerTeam === 2 && <Trophy />}</h4>
            {game.team2.map((player) => (
              <div key={player.name}>
                <span>{player.name} ({player.rank}⭐)</span>
                <button onClick={() => openModal(player)}>Pagar</button>
              </div>
            ))}

            <h4>Alterações de Ranking</h4>
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

      {/* Modal de Pagamento */}
      {isModalOpen && selectedPlayer && (
        <div className="modal-overlay">
          <motion.div className="modal" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <h2>Pagamento</h2>
            <p>Jogador: <strong>{selectedPlayer.name}</strong></p>

            <label>
              Multa (R$):
              <input
                type="number"
                value={fineValue}
                onChange={(e) => setFineValue(e.target.value)}
                placeholder="0.00"
              />
            </label>

            <div className="modal-actions">
              <button onClick={handleConfirmPayment}>Confirmar Pagamento</button>
              <button onClick={closeModal}>Cancelar</button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default History;
