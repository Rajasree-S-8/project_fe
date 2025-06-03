import './viewroom.css';

const ViewRooms = () => {
  // In a real app, you would fetch this data from an API
  const rooms = [
    
  ];

  return (
    <div className="card">
      <div className="card-header">View Rooms</div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Room Number</th>
                <th>Type</th>
                <th>Price ($)</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => (
                <tr key={index}>
                  <td>{room.roomNumber}</td>
                  <td>{room.type}</td>
                  <td>{room.price}</td>
                  <td>
                    <span className={`badge ${room.available ? 'bg-success' : 'bg-danger'}`}>
                      {room.available ? 'Available' : 'Booked'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewRooms;