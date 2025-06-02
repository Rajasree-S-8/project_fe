import './css/ViewBookings.css'

function ViewBookings() {
  const bookings = [
    { id: 'B001', customer: 'John Doe', room: '202', checkIn: '2025-06-01', checkOut: '2025-06-05' },
    { id: 'B002', customer: 'Jane Smith', room: '303', checkIn: '2025-06-03', checkOut: '2025-06-07' },
  ];

  return (
    <div className="container">
      <h1>View Bookings</h1>
      <div className="card">
        <div className="card-header">Booking List</div>
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Room</th>
                <th>Check-In</th>
                <th>Check-Out</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.customer}</td>
                  <td>{booking.room}</td>
                  <td>{booking.checkIn}</td>
                  <td>{booking.checkOut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewBookings;