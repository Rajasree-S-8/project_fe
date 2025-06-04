import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(savedOrders);
  }, []);

  const updateOrderStatus = (id, status) => {
    const updatedOrders = orders.map(order => 
      order.id === id ? { ...order, status } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Customer Orders</h1>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/home')}
        >
          Back to Home
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="alert alert-info">No orders found</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className={order.status === 'Pending' ? 'table-warning' : ''}>
                  <td>{order.id.substring(0, 8)}</td>
                  <td>{order.customerName}</td>
                  <td>
                    <ul className="list-unstyled">
                      {order.items.map((item, i) => (
                        <li key={i}>{item.name} (x{item.quantity})</li>
                      ))}
                    </ul>
                  </td>
                  <td>₹{order.total.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${order.status === 'Pending' ? 'bg-warning' : 'bg-success'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {order.status === 'Pending' && (
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => updateOrderStatus(order.id, 'Completed')}
                      >
                        Mark Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewOrders;