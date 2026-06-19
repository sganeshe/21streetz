import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { orderService } from "../services/order.service"; 

export default function OrderDetail({ orderId: propOrderId, onClose }) {
  const { selectedOrder: ctxOrderId, setSelectedOrder } = useAppContext();
  const orderId = propOrderId || ctxOrderId;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    const load = async () => {
      try {
        const res = await orderService.getById(orderId);
        setOrder(res.order || null);
      } catch (err) {
        console.error("Failed to load order", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orderId]);

  if (loading) return <div style={{ padding: "2rem", color: "#ff0000", fontFamily: "monospace" }}>Retrieving data...</div>;
  if (!order) return <div style={{ padding: "2rem", color: "#ff0000", fontFamily: "monospace" }}>[ERROR] Order not found</div>;

  const handleClose = () => {
    if (onClose) return onClose();
    setSelectedOrder(null);
  };

  return (
    <div style={{ position:"relative", padding: "2rem", color: "#ff0000", fontFamily: "monospace", fontSize: "13px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #ff0000", paddingBottom: "1rem", marginBottom: "2rem" }}>
        <div>
          <h3 style={{ fontSize: "20px", textAlign: "left", fontWeight: "normal", margin: "0 0 8px 0" }}>RECEIPT</h3>
          <div style={{ fontSize: "15px", textAlign: "left", opacity: 0.7 }}>ID: {order._id}</div>
          <div style={{ fontSize: "15px", textAlign: "left", opacity: 0.7 }}>DATE: {new Date(order.createdAt).toLocaleDateString()}</div>
        </div>
        <span onClick={handleClose} style={{ fontSize: "15px", cursor: "pointer", textDecoration: "underline" }}>close [x]</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2rem" }}>
        {order.orderItems.map((it, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{fontSize: "15px", textAlign: "left", textTransform: "uppercase" }}>{it.name}</span>
              <span style={{ fontSize: "13px", textAlign: "left", opacity: 0.7 }}>SIZE: {it.size} | QTY: {it.qty}</span>
            </div>
            <span style={{ fontSize: "15px", textAlign: "right" }}>₹{(it.price * it.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px dashed #ff0000", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{fontSize: "15px", textAlign: "left", opacity: 0.7 }}>STATUS</span>
          <span style={{ fontSize: "15px", textAlign: "right" }}>{order.isPaid ? "PAID" : "PENDING"}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "15px", textAlign: "left", opacity: 0.7 }}>SHIPPING</span>
          <span style={{ fontSize: "15px", textAlign: "right" }}>{order.isDelivered ? "DELIVERED" : "PROCESSING"}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", borderTop: "1px solid #ff0000", paddingTop: "1rem", fontSize: "13px" }}>
          <span style={{ fontSize: "15px", textAlign: "left" }}>TOTAL</span>
          <span style={{ fontSize: "15px", textAlign: "right" }}>₹{order.totalPrice.toFixed(2)}</span>
        </div>
      </div>
      
      {order.shippingAddress && (
        <div style={{ display: "flex", flexDirection: "column", marginTop: "1rem", borderTop: "1px solid #bbb", paddingTop: "1rem" }}>
          <span style={{ fontSize: "15px", textAlign: "left", opacity: 0.7, marginBottom: "-1rem" }}>SHIPPING TO:</span>
          <span style={{ fontSize: "15px", textAlign: "right", marginBottom: "-1rem" }}>{order.shippingAddress.address}</span><br></br>
          <span style={{ fontSize: "15px", textAlign: "right", marginBottom: "-1rem" }}>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</span><br></br>
          <span style={{ fontSize: "15px", textAlign: "right" }}>{order.shippingAddress.country}</span>
        </div>
      )}
    </div>
  );
}