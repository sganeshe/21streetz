import React, { useEffect, useState } from "react";
import { orderService } from "../services/order.service"; 
import { useAppContext } from "../context/AppContext";
import OrderDetail from "./OrderDetail";
import { useAuth } from "../context/AuthContext";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openOrderId, setOpenOrderId] = useState(null);
  const { navTo } = useAppContext();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await orderService.getMyOrders(); 
        setOrders(res.orders || []);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLogout = () => {
    if (window.confirm('Logout?')) {
      logout();
      navTo('home');
    }
  };

  if (loading) {
    return <div className="orders-page">Loading records...</div>;
  }
  
  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="orders-header">
          <h3>Order History</h3>
          {isAuthenticated && (
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          )}
        </div>
        <div className="orders-empty">
          <p style={{ fontSize: '25px', marginBottom: '1rem' }}>NO ORDER HISTORY FOUND.</p>
          <span 
            onClick={() => navTo('shop')} 
            style={{ fontSize: '18px', cursor: 'pointer', textDecoration: 'underline' }}
          >
            return to shop
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h3>ORDER HISTORY</h3>
        {isAuthenticated && (
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        )}
      </div>
      
      <div className="orders-list">
        {orders.map((o) => (
          <div key={o._id} className="order-card">
            
            <div className="order-info">
              <div className="order-row">
                <span className="order-label" style={{ textAlign: 'right', paddingRight: '1rem' }}>ORDER ID</span>
                <span className="order-val" style={{ textAlign: 'left'}}>{o._id}</span>
              </div>
              <div className="order-row">
                <span className="order-label" style={{ textAlign: 'right', paddingRight: '1rem' }}>STATUS</span>
                <span className="order-val" style={{ textAlign: 'left'}}>{o.isPaid ? "PAID" : "PENDING"} / {o.isDelivered ? "DELIVERED" : "PROCESSING"}</span>
              </div>
              <div className="order-row">
                <span className="order-label" style={{ textAlign: 'right', paddingRight: '1rem' }}>TOTAL</span>
                <span className="order-val" style={{ textAlign: 'left'}}>₹{o.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={() => setOpenOrderId(o._id)} 
              className="btn-order-view"
            >
              VIEW DETAILS
            </button>
          </div>
        ))}
      </div>

      {openOrderId && (
        <div className="order-modal-overlay">
          <div className="order-modal-content">
            <OrderDetail orderId={openOrderId} onClose={() => setOpenOrderId(null)} />
          </div>
        </div>
      )}
    </div>
  );
}