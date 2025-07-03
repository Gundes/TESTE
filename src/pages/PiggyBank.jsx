import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PiggyBank as PiggyBankIcon, Plus, Minus, ArrowUp, ArrowDown, Calendar, MessageSquare } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

const TransactionForm = ({ type, onSave, closeDialog }) => {
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido.",
        variant: "destructive"
      });
      return;
    }
    onSave({ amount: numericAmount, comment });
    closeDialog();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-white">Valor (R$)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="comment" className="text-white">Comentário (opcional)</Label>
        <Input
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Ex: Multa do João"
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
        />
      </div>
      <Button type="submit" className={`w-full ${type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}>
        {type === 'income' ? 'Adicionar' : 'Retirar'}
      </Button>
    </form>
  );
};

const PiggyBank = () => {
  const [balance, setBalance] = useLocalStorage('futsal-piggy-bank-balance', 0);
  const [history, setHistory] = useLocalStorage('futsal-piggy-bank-history', []);
  const [isIncomeOpen, setIsIncomeOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);

  const handleTransaction = (type, { amount, comment }) => {
    const newTransaction = {
      id: Date.now().toString(),
      type,
      amount,
      comment,
      date: new Date().toISOString(),
    };

    if (type === 'income') {
      setBalance(prev => prev + amount);
    } else {
      if (amount > balance) {
        toast({
          title: "Erro",
          description: "Não há saldo suficiente para esta retirada.",
          variant: "destructive"
        });
        return;
      }
      setBalance(prev => prev - amount);
    }

    setHistory(prev => [newTransaction, ...prev]);
    toast({
      title: "Sucesso!",
      description: `Transação de ${type === 'income' ? 'entrada' : 'saída'} registrada.`,
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
        <h1 className="text-3xl font-bold text-white">Cofrinho de Multas</h1>
        <p className="text-gray-300">Gerencie o dinheiro das multas da equipa</p>
      </motion.div>

      {/* Balance Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 120 }}
        className="glass-effect rounded-xl p-8 text-center pulse-glow"
      >
        <PiggyBankIcon className="w-16 h-16 text-pink-400 mx-auto mb-4" />
        <p className="text-gray-300 text-lg">Saldo Atual</p>
        <p className="text-5xl font-bold text-white">
          R$ {balance.toFixed(2).replace('.', ',')}
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row justify-center gap-4"
      >
        <Dialog open={isIncomeOpen} onOpenChange={setIsIncomeOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white flex-1 py-6 text-lg">
              <Plus className="w-5 h-5 mr-2" /> Adicionar Dinheiro
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-effect border-white/20">
            <DialogHeader>
              <DialogTitle className="text-white">Adicionar Entrada</DialogTitle>
            </DialogHeader>
            <TransactionForm type="income" onSave={(data) => handleTransaction('income', data)} closeDialog={() => setIsIncomeOpen(false)} />
          </DialogContent>
        </Dialog>

        <Dialog open={isExpenseOpen} onOpenChange={setIsExpenseOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white flex-1 py-6 text-lg">
              <Minus className="w-5 h-5 mr-2" /> Retirar Dinheiro
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-effect border-white/20">
            <DialogHeader>
              <DialogTitle className="text-white">Registrar Saída</DialogTitle>
            </DialogHeader>
            <TransactionForm type="expense" onSave={(data) => handleTransaction('expense', data)} closeDialog={() => setIsExpenseOpen(false)} />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-effect rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">Histórico de Transações</h2>
        {history.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Nenhuma transação registrada ainda.</p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg"
              >
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${item.type === 'income' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {item.type === 'income' ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className={`font-semibold ${item.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                      {item.type === 'income' ? '+' : '-'} R$ {item.amount.toFixed(2).replace('.', ',')}
                    </p>
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  {item.comment && (
                    <div className="flex items-center space-x-2 text-gray-300 mt-1 text-sm">
                      <MessageSquare className="w-3 h-3" />
                      <span>{item.comment}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PiggyBank;