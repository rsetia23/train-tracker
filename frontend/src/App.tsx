import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Track from "./pages/Track";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/track/:trainId" element={<Track />} />
      </Routes>
    </BrowserRouter>
  );
}
