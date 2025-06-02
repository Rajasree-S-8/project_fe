import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import AddRooms from './components/AddRooms'
import ViewRooms from './components/ViewRooms'
import ViewCustomers from './components/ViewCustomers'
import ViewBookings from './components/ViewBookings'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/addrooms" element={<AddRooms/>} />
          <Route path="/viewrooms" element={<ViewRooms/>} />
          <Route path="/viewcustomers" element={<ViewCustomers/>} />
          <Route path="/viewbookings" element={<ViewBookings/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
