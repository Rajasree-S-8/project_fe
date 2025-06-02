import { useState } from 'react';
import './css/ViewRooms.css'

function ViewRooms() {
  
  const [rooms, setRooms] = useState([]);

  return (
    <div className="container">
      <h1>View Rooms</h1>
      <div className="card">
        <div className="card-header">Room List</div>
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Room Number</th>
                <th>Type</th>
                <th>Price (₹)</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.roomNumber}</td>
                  <td>{room.type}</td>
                  <td>{room.price}</td>
                  <td>{room.availability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewRooms;