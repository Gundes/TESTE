import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Users, Shuffle, Trophy, History, PiggyBank } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/players', icon: Users, label: 'Jogadores' },
    { path: '/team-generator', icon: Shuffle, label: 'Gerar Equipas' },
    { path: '/game-result', icon: Trophy, label: 'Resultado' },
    { path: '/history', icon: History, label: 'Histórico' },
    { path: '/piggy-bank', icon: PiggyBank, label: 'Cofrinho' },
  ];

  return (
    <nav className="glass-effect border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚽</span>
            </div>
            <span className="font-bold text-xl gradient-text">Futsal Manager</span>
          </Link>

          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'hover:bg-white/10 text-gray-300 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium hidden md:block">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;