import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from './pages/Landing.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Upload from './pages/Upload.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ReadingRoom from './pages/ReadingRoom.jsx';
import WordLabView from './pages/WordLabView.jsx';
import ClickSpark from './components/ClickSpark.jsx';
import PageTransition from './components/PageTransition.jsx';

const App = () => {
  const location = useLocation();

  return (
    <ClickSpark
      sparkColor='#fff'
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <div style={{ width: '100%', overflowX: 'hidden' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
            <Route path="/home" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/upload" element={<PageTransition><Upload /></PageTransition>} />
            <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
            <Route path="/reader" element={<PageTransition><ReadingRoom /></PageTransition>} />
            <Route path="/word-lab" element={<PageTransition><WordLabView /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </div>
    </ClickSpark>
  );
};

export default App;


