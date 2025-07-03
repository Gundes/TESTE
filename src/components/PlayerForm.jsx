
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StarRating from '@/components/StarRating';
import { toast } from '@/components/ui/use-toast';

const PlayerForm = ({ isOpen, onClose, onSave, player = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    rank: 5,
    image: ''
  });

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name,
        rank: player.rank,
        image: player.image || ''
      });
    } else {
      setFormData({
        name: '',
        rank: 5,
        image: ''
      });
    }
  }, [player, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do jogador é obrigatório",
        variant: "destructive"
      });
      return;
    }

    onSave({
      ...formData,
      id: player?.id || Date.now().toString()
    });
    
    onClose();
    
    toast({
      title: "Sucesso",
      description: player ? "Jogador atualizado com sucesso!" : "Jogador adicionado com sucesso!"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">
            {player ? 'Editar Jogador' : 'Adicionar Jogador'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Nome</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome do jogador"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-white">Ranking (1-10 estrelas)</Label>
            <StarRating
              rating={formData.rank}
              onRatingChange={(rating) => setFormData({ ...formData, rank: rating })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image" className="text-white">URL da Imagem (opcional)</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://exemplo.com/imagem.jpg"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {player ? 'Atualizar' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerForm;
