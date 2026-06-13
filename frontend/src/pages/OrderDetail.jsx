import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
// FIXED: Changed to singular orderService
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
        // FIXED: Using singular orderService
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
    <div style={{ padding: "2rem", color: "#ff0000", fontFamily: "monospace", fontSize: "11px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #ff0000", paddingBottom: "1rem", marginBottom: "2rem" }}>
        <div>
          <h3 style={{ fontSize: "13px", fontWeight: "normal", margin: "0 0 8px 0" }}>RECEIPT</h3>
          <div style={{ opacity: 0.7 }}>ID: {order._id}</div>
          <div style={{ opacity: 0.7 }}>DATE: {new Date(order.createdAt).toLocaleDateString()}</div>
        </div>
        <span onClick={handleClose} style={{ cursor: "pointer", textDecoration: "underline" }}>close [x]</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2rem" }}>
        {order.orderItems.map((it, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ textTransform: "uppercase" }}>{it.name}</span>
              <span style={{ opacity: 0.7 }}>SIZE: {it.size} | QTY: {it.qty}</span>
            </div>
            <span>₹{(it.price * it.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px dashed #ff0000", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ opacity: 0.7 }}>STATUS</span>
          <span>{order.isPaid ? "PAID" : "PENDING"}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ opacity: 0.7 }}>SHIPPING</span>
          <span>{order.isDelivered ? "DELIVERED" : "PROCESSING"}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", borderTop: "1px solid #ff0000", paddingTop: "1rem", fontSize: "13px" }}>
          <span>TOTAL</span>
          <span>₹{order.totalPrice.toFixed(2)}</span>
        </div>
      </div>
      
      {order.shippingAddress && (
        <div style={{ marginTop: "2rem", borderTop: "1px solid #333", paddingTop: "1rem" }}>
          <div style={{ opacity: 0.7, marginBottom: "8px" }}>SHIPPING TO:</div>
          <div>{order.shippingAddress.address}</div>
          <div>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</div>
          <div>{order.shippingAddress.country}</div>
        </div>
      )}
    </div>
  );
}