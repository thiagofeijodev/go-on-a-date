import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Invite from './pages/Invite';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/invite/:token" element={<Invite />} />
      </Routes>
    </HashRouter>
  );
}
