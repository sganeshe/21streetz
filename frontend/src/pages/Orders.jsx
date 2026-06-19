import React, { useEffect, useState, useRef } from "react";
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

  if (loading) return <div style={{ padding: "2rem", color: "#ff0000", fontFamily: "monospace" }}>Loading records...</div>;
  
  if (orders.length === 0) return (
    <div style={{ position: 'relative', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', color: '#ff0000', fontFamily: 'monospace' }}>
      {isAuthenticated && (
        <button
          onClick={() => {
            if (window.confirm('Logout?')) {
              logout();
              navTo('home');
            }
          }}
          style={{ position: 'fixed', top: 16, right: 16, background: 'transparent', color: '#ff0000', border: '1px solid #ff0000', padding: '8px 12px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '15px' }}
        >
          Logout
        </button>
      )}

      <div style={{ marginBottom: "350px", alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontSize: '25px', fontWeight: 'normal', marginBottom: '1rem' }}>NO ORDER HISTORY FOUND.</p>
        <span onClick={() => navTo('shop')} style={{ fontSize: '18px', cursor: 'pointer', textDecoration: 'underline', display: 'inline-block', marginBottom: '0.5rem' }}>return to shop</span>
      </div>
    </div>
  );
    
    

  return (
    <div className="orders" style={{ padding: "2rem", color: "#ff0000", fontFamily: "monospace", position: "relative" }}>
      {isAuthenticated && (
        <button
          onClick={() => {
            if (window.confirm('Logout?')) {
              logout();
              navTo('home');
            }
          }}
          style={{ position: 'absolute', top: "1rem", right: '2rem', background: 'transparent', color: '#ff0000', border: '1px solid #ff0000', padding: '8px 12px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '15px' }}
        >
          Logout
        </button>
      )}
      
      <h3 style={{ fontSize: "25px", textAlign: "left", fontWeight: "normal", marginBottom: "2rem", marginTop: "-1rem" }}>ORDER HISTORY</h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {orders.map((o) => (
          <div key={o._id} style={{ border: "1px solid #ff0000", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "11px" }}>
              <div style={{ display: "flex" }}><span style={{ fontSize: "15px", textAlign: "left", width: "80px", opacity: 0.7 }}>ORDER ID</span><span style={{fontSize: "15px", textAlign: "left"}}>{o._id}</span></div>
              <div style={{ display: "flex" }}><span style={{ fontSize: "15px", textAlign: "left", width: "80px", opacity: 0.7 }}>STATUS</span><span style={{fontSize: "15px", textAlign: "left"}}>{o.isPaid ? "PAID" : "PENDING"} / {o.isDelivered ? "DELIVERED" : "PROCESSING"}</span></div>
              <div style={{ display: "flex" }}><span style={{ fontSize: "15px", textAlign: "left", width: "80px", opacity: 0.7 }}>TOTAL</span><span style={{fontSize: "15px", textAlign: "left"}}>₹{o.totalPrice.toFixed(2)}</span></div>
            </div>
            
            <button 
              onClick={() => setOpenOrderId(o._id)} 
              style={{ background: "transparent", color: "#ff0000", border: "1px solid #ff0000", padding: "25px 12px", cursor: "pointer", fontFamily: "monospace", fontSize: "15px" }}
            >
              VIEW DETAILS
            </button>
          </div>
        ))}
      </div>

      {openOrderId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 200 }}>
          <div style={{ width: "min(1200px, 95%)", maxHeight: "90vh", overflowY: "auto", background: "#050505", border: "1px solid #ff0000" }}>
            <OrderDetail orderId={openOrderId} onClose={() => setOpenOrderId(null)} />
          </div>
        </div>
      )}
    </div>
  );
}