import './css/ViewCustomers.css'

function ViewCustomers() {
  const customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-1234' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-5678' },
  ];

  return (
    <div className="container">
      <h1>View Customers</h1>
      <div className="card">
        <div className="card-header">Customer List</div>
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewCustomers;