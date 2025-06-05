import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/homepage/homepage";
import "./components/homepage/homepage.css"; 
import Admin from "./components/admin/adminlog";
import Adminlog from './components/admin/admin';
import Hotellogin from "./components/hotelmanager/hotelogin/hotelogin";
import Hotelhome from "./components/hotelmanager/hotelhome/hotelhome";



function App() {
  return (
    <div>
        <Router>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/adminlog' element={<Adminlog />} />
        <Route path='/hotelogin' element={<Hotellogin />} />
        <Route path="/hotelhome" element={<Hotelhome/>} />
        
        

      </Routes>
    </Router>
    </div>
  );
}
export default App;