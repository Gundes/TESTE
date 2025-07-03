
import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, User } from 'lucide-react';
import StarRating from '@/components/StarRating';
import { Button } from '@/components/ui/button';

const PlayerCard = ({ player, onEdit, onDelete, onSelect, isSelected, showActions = true }) => {
  return (
    <motion.div
      className={`player-card ${isSelected ? 'ring-2 ring-green-400 bg-green-500/20' : ''}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
    >
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
          {player.image ? (
            <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-white" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-white">{player.name}</h3>
          <StarRating rating={player.rank} readonly size="w-4 h-4" />
        </div>
        
        {showActions && (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(player);
              }}
              className="hover:bg-blue-500/20 hover:text-blue-400"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(player.id);
              }}
              className="hover:bg-red-500/20 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PlayerCard;
