import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/Navigation';
import Dashboard from '@/pages/Dashboard';
import Players from '@/pages/Players';
import TeamGenerator from '@/pages/TeamGenerator';
import GameResult from '@/pages/GameResult';
import History from '@/pages/History';
import PlayerStats from '@/pages/PlayerStats';
import PiggyBank from '@/pages/PiggyBank';

function App() {
  return (
    <Router>
      <Helmet>
        <title>Futsal Manager - Gestão de Equipas e Jogadores</title>
        <meta name="description" content="Aplicação completa para gestão de jogadores de futsal, geração de equipas equilibradas e acompanhamento de estatísticas." />
      </Helmet>
      
      <div className="min-h-screen">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/players" element={<Players />} />
            <Route path="/team-generator" element={<TeamGenerator />} />
            <Route path="/game-result" element={<GameResult />} />
            <Route path="/history" element={<History />} />
            <Route path="/player/:id" element={<PlayerStats />} />
            <Route path="/piggy-bank" element={<PiggyBank />} />
          </Routes>
        </main>
        
        <Toaster />
      </div>
    </Router>
  );
}

export default App;