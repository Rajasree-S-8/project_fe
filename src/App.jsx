import React from "react";

import Login from "./components/Restaurantmanager/login/Login.jsx";
import { BrowserRouter,Routes, Route } from "react-router-dom";
import HomePage from "./components/Restaurantmanager/homepage/HomePage.jsx";
import AddFood from "./components/Restaurantmanager/addfood/AddFood.jsx";
import EditFood from "./components/Restaurantmanager/addfood/EditFood.jsx";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import ViewFood from "./components/Restaurantmanager/viewfood/ViewFood.jsx";

import ViewOrders from "./components/Restaurantmanager/viewfood/ViewOrders.jsx";




function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}></Route>
          <Route path="/home" element={<HomePage/>}></Route>
          <Route path="/addfood" element={<AddFood />} />
          <Route path="/edit-food/:id" element={<EditFood />} />
          <Route path="/viewfood" element={<ViewFood/>} />
          <Route path="/vieworders" element={<ViewOrders/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;