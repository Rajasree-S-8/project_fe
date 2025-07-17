import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/homepage/homepage";
import "./components/homepage/homepage.css";
import AdminLogin from "./components/admin/adminlog";
import Admin from "./components/admin/admin";
import Hotellogin from "./components/hotelmanager/hotelogin/hotelogin";
import Hotelhome from "./components/hotelmanager/hotelhome/hotelhome";
import Customerreg from "./components/customer/CustomerRegister/Customerreg";
import Customerlogin from "./components/customer/CustomerLogin/Customerlogin";
import Customerhome from "./components/customer/CustomerHome/Customerhome";
import Customerroom from "./components/customer/CustomerRooms/Customerroom";
import Customerfood from "./components/customer/CustomerFood/Customerfood";
import Customerbookings from "./components/customer/CustomerBookings/Customerbookings.jsx";
import Customerorders from "./components/customer/CustomerBookings/Customerorders.jsx";
import Restaurantlog from "./components/Restaurantmanager/login/Login.jsx";
import RestaurantHomePage from "./components/Restaurantmanager/homepage/HomePage.jsx";
import Profile from "./components/Restaurantmanager/profile/profile.jsx";
import AddFood from "./components/Restaurantmanager/addfood/AddFood.jsx";
import EditFood from "./components/Restaurantmanager/addfood/EditFood.jsx";
import ViewFood from "./components/Restaurantmanager/viewfood/ViewFood.jsx";
import ViewBookings from "./components/hotelmanager/viewbooking/viewbooking.jsx";
import ViewOrders from "./components/Restaurantmanager/viewfood/ViewOrders.jsx";
import AddRoom from "./components/hotelmanager/addrooms/addrooms.jsx";
import ViewRooms from "./components/hotelmanager/viewrooms/viewroom.jsx";
import ViewCustomers from "./components/hotelmanager/viewcustomer/viewcustomer.jsx";
import Profile1 from "./components/hotelmanager/profile/profile.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />

      

        {/* Hotel Manager Routes */}
        <Route path="/hotelogin" element={<Hotellogin />} />
        <Route path="/hotelhome" element={<Hotelhome />} />
        <Route path="/hotel/addroom" element={<AddRoom />} />
        <Route path="/hotel/viewrooms" element={<ViewRooms />} />
        <Route path="/hotel/viewcustomers" element={<ViewCustomers />} />
        <Route path="/hotel/view-bookings" element={<ViewBookings />} />
        <Route path="/profile1" element={<Profile1 />} />

        {/* Customer Routes */}
        <Route path="/custlog" element={<Customerlogin />} />
        <Route path="/custreg" element={<Customerreg />} />
        <Route path="/custhome" element={<Customerhome />} />
        <Route path="/custroom" element={<Customerroom />} />
        <Route path="/custfood" element={<Customerfood />} />
        <Route path="/my-bookings" element={<Customerbookings />} />
        <Route path="/my-orders" element={<Customerorders />} />

        {/* Restaurant Manager Routes */}
        <Route path="/restaurantlog" element={<Restaurantlog />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/restauranthome" element={<RestaurantHomePage />} />
        <Route path="/addfood" element={<AddFood />} />
        <Route path="/edit-food/:id" element={<EditFood />} />
        <Route path="/viewfood" element={<ViewFood />} />
        <Route path="/vieworders" element={<ViewOrders />} />
      </Routes>
    </Router>
  );
}

export default App;