import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/homepage/homepage";
import "./components/homepage/homepage.css"; 
import Admin from "./components/admin/adminlog";
import Adminlog from './components/admin/admin';
import Hotellogin from "./components/hotelmanager/hotelogin/hotelogin";
import Hotelhome from "./components/hotelmanager/hotelhome/hotelhome";
import Customerreg from "./components/customer/CustomerRegister/Customerreg";
import Customerlogin from "./components/customer/CustomerLogin/Customerlogin";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import Login from "./components/Restaurantmanager/login/Login.jsx";
// import HomePage from "./components/Restaurantmanager/homepage/HomePage.jsx";
// import AddFood from "./components/Restaurantmanager/addfood/AddFood.jsx";
// import EditFood from "./components/Restaurantmanager/addfood/EditFood.jsx";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import ViewFood from "./components/Restaurantmanager/viewfood/ViewFood.jsx";

// import ViewOrders from "./components/Restaurantmanager/viewfood/ViewOrders.jsx";


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
          <Route path='/custlog' element={<Customerlogin/>} />
          <Route path='/custreg' element={<Customerreg/>} />
        </Routes>
      </Router>
        <Router>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/adminlog' element={<Adminlog />} />
        <Route path='/hotelogin' element={<Hotellogin />} />
        <Route path="/hotelhome" element={<Hotelhome/>} />
        
        

      </Routes>
    </Router>
      {/* <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}></Route>
          <Route path="/home" element={<HomePage/>}></Route>
          <Route path="/addfood" element={<AddFood />} />
          <Route path="/edit-food/:id" element={<EditFood />} />
          <Route path="/viewfood" element={<ViewFood/>} />
          <Route path="/vieworders" element={<ViewOrders/>} />
        </Routes>
      </BrowserRouter> */}
    </div>
  );
}
export default App;



