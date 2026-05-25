import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Invite from './pages/Invite';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/invite/:token" element={<Invite />} />
      </Routes>
    </BrowserRouter>
  );
}
