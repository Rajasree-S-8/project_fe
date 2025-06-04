import React from "react";

import Login from "./components/Login.jsx";
import { BrowserRouter,Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage.jsx";
import AddFood from "./components/AddFood"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import ViewFood from "./components/ViewFood.jsx";
import ViewOrders from "./components/ViewOrders.jsx";



function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}></Route>
          <Route path="/home" element={<HomePage/>}></Route>
          <Route path="/addfood" element={<AddFood />} />
          <Route path="/viewfood" element={<ViewFood/>} />
          <Route path="/vieworders" element={<ViewOrders/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;