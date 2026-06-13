import React, { useEffect, useState } from "react";
// FIXED: Changed to singular orderService
import { orderService } from "../services/order.service"; 
import { useAppContext } from "../context/AppContext";
import OrderDetail from "./OrderDetail";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openOrderId, setOpenOrderId] = useState(null);
  const { navTo } = useAppContext();

  useEffect(() => {
    const load = async () => {
      try {
        // FIXED: Using singular orderService
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
    <div style={{ padding: "2rem", color: "#ff0000", fontFamily: "monospace" }}>
      <p style={{ marginBottom: "1rem" }}>NO ORDER HISTORY FOUND.</p>
      <span onClick={() => navTo("shop")} style={{ cursor: "pointer", textDecoration: "underline" }}>return to shop</span>
    </div>
  );

  return (
    <div style={{ padding: "2rem", color: "#ff0000", fontFamily: "monospace" }}>
      <h3 style={{ fontSize: "13px", fontWeight: "normal", marginBottom: "2rem" }}>ORDER HISTORY</h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {orders.map((o) => (
          <div key={o._id} style={{ border: "1px solid #ff0000", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "11px" }}>
              <div style={{ display: "flex" }}><span style={{ width: "80px", opacity: 0.7 }}>ORDER ID</span><span>{o._id}</span></div>
              <div style={{ display: "flex" }}><span style={{ width: "80px", opacity: 0.7 }}>STATUS</span><span>{o.isPaid ? "PAID" : "PENDING"} / {o.isDelivered ? "DELIVERED" : "PROCESSING"}</span></div>
              <div style={{ display: "flex" }}><span style={{ width: "80px", opacity: 0.7 }}>TOTAL</span><span>₹{o.totalPrice.toFixed(2)}</span></div>
            </div>
            
            <button 
              onClick={() => setOpenOrderId(o._id)} 
              style={{ background: "transparent", color: "#ff0000", border: "1px solid #ff0000", padding: "8px 16px", cursor: "pointer", fontFamily: "monospace", fontSize: "11px" }}
            >
              VIEW DETAILS
            </button>
          </div>
        ))}
      </div>

      {openOrderId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 200 }}>
          <div style={{ width: "min(600px, 95%)", maxHeight: "85vh", overflowY: "auto", background: "#050505", border: "1px solid #ff0000" }}>
            <OrderDetail orderId={openOrderId} onClose={() => setOpenOrderId(null)} />
          </div>
        </div>
      )}
    </div>
  );
}