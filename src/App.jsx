import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/homepage/homepage";
import "./components/homepage/homepage.css"; 
import Admin from "./components/admin/adminlog";
import Adminlog from './components/admin/admin';



function App() {
  return (
    <div>
        <Router>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/adminlog' element={<Adminlog />} />
      </Routes>
    </Router>
    </div>
  );
}
export default App;