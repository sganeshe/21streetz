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

  if (loading) return <div className="order-detail-container">Retrieving data...</div>;
  if (!order) return <div className="order-detail-container">[ERROR] Order not found</div>;

  const handleClose = () => {
    if (onClose) return onClose();
    setSelectedOrder(null);
  };

  return (
    <div className="order-detail-container">
      
      {/* Header section */}
      <div className="od-header">
        <div className="od-header-info">
          <h3>RECEIPT</h3>
          <div className="od-meta">ID: {order._id}</div>
          <div className="od-meta">DATE: {new Date(order.createdAt).toLocaleDateString()}</div>
        </div>
        <span onClick={handleClose} className="od-close">close [x]</span>
      </div>

      {/* Items section */}
      <div className="od-items">
        {order.orderItems.map((it, i) => (
          <div key={i} className="od-item">
            <div className="od-item-info">
              <span className="od-item-name">{it.name}</span>
              <span className="od-item-meta">SIZE: {it.size} | QTY: {it.qty}</span>
            </div>
            <span className="od-item-price">₹{(it.price * it.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Summary section */}
      <div className="od-summary">
        <div className="od-summary-row">
          <span className="od-summary-label">STATUS</span>
          <span className="od-summary-value">{order.isPaid ? "PAID" : "PENDING"}</span>
        </div>
        <div className="od-summary-row">
          <span className="od-summary-label">SHIPPING</span>
          <span className="od-summary-value">{order.isDelivered ? "DELIVERED" : "PROCESSING"}</span>
        </div>
        <div className="od-summary-row od-total-row">
          <span className="od-summary-label" style={{ opacity: 1 }}>TOTAL</span>
          <span className="od-summary-value">₹{order.totalPrice.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Shipping Address section */}
      {order.shippingAddress && (
        <div className="od-shipping">
          <span className="od-shipping-label">SHIPPING TO:</span>
          <div className="od-shipping-address">
            <div>{order.shippingAddress.address}</div>
            <div>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</div>
            <div>{order.shippingAddress.country}</div>
          </div>
        </div>
      )}
      
    </div>
  );
}