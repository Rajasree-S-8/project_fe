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
import Customerhome from "./components/customer/CustomerHome/Customerhome";
import Restaurantlog from "./components/Restaurantmanager/login/Login.jsx";
import RestaurantHomePage from "./components/Restaurantmanager/homepage/HomePage.jsx";
import Profile from "./components/Restaurantmanager/profile/profile.jsx";
import AddFood from "./components/Restaurantmanager/addfood/AddFood.jsx";
import EditFood from "./components/Restaurantmanager/addfood/EditFood.jsx";

import ViewFood from "./components/Restaurantmanager/viewfood/ViewFood.jsx";

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
          <Route path='/custhome' element={<Customerhome/>} />
          <Route path="restaurantlog" element={<Restaurantlog/>}></Route>
          <Route path="/profile" element={<Profile />} />
          <Route path="/restauranthome" element={<RestaurantHomePage/>}></Route>
          <Route path="/addfood" element={<AddFood />} />
          <Route path="/edit-food/:id" element={<EditFood />} />
          <Route path="/viewfood" element={<ViewFood/>} />


        </Routes>
      </Router>
        <Router>
     
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



