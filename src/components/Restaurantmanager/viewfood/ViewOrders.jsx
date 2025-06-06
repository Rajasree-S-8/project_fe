import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../header/Header.jsx";
import './ViewOrders.css';

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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
    <div className="view-orders-page">
      <Header />
      <div className="container my-5">
        <h1>Customer Orders</h1>

        {orders.length === 0 ? (
          <div className="no-orders text-center py-5">
            <img 
              src="https://cdni.iconscout.com/illustration/premium/thumb/no-order-4373618-3649467.png" 
              alt="No orders"
              className="img-fluid mb-4"
              style={{ maxWidth: '300px' }}
            />
            <h3>No orders found</h3>
            <p>When customers place orders, they will appear here</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover orders-table">
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
                  <tr key={order.id} className={order.status === 'Pending' ? 'pending-order' : ''}>
                    <td>{order.id.substring(0, 8)}</td>
                    <td>{order.customerName}</td>
                    <td>
                      <ul className="list-unstyled">
                        {order.items.map((item, i) => (
                          <li key={i} className="order-item">
                            <span className="item-name">{item.name}</span>
                            <span className="item-quantity">(x{item.quantity})</span>
                          </li>
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
                          className="btn btn-sm complete-btn"
                          onClick={() => updateOrderStatus(order.id, 'Completed')}
                        >
                          <i className="fas fa-check me-1"></i>Complete
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
    </div>
  );
};

export default ViewOrders;