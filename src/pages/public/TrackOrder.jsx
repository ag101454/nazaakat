// src/pages/public/TrackOrder.jsx
import { useState } from 'react';

function TrackOrder() {
  const [orderId, setOrderId] = useState('');

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-md mx-auto px-4 text-center">
        <h1 className="text-4xl font-serif mb-6">Track Order</h1>
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter Order ID"
          className="w-full p-3 border rounded-lg mb-4"
        />
        <button className="w-full py-3 bg-gold-500 text-white rounded-full">
          Track
        </button>
        <p className="mt-4 text-sm text-gray-500">
          Your order ID was sent to you via WhatsApp
        </p>
      </div>
    </div>
  );
}

export default TrackOrder;