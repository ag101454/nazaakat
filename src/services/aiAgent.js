import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

export const AIAgent = {
  processOrder: async (orderData) => {
    try {
      const orderRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        status: 'pending',
        aiProcessed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const analysis = AIAgent.analyzeOrder(orderData);
      
      await updateDoc(doc(db, 'orders', orderRef.id), {
        aiAnalysis: analysis,
        aiProcessed: true,
      });

      // NEVER auto-accept - admin must manually approve
      return {
        orderId: orderRef.id,
        analysis,
        autoAccepted: false
      };
    } catch (error) {
      console.error('AI Agent error:', error);
      throw error;
    }
  },

  analyzeOrder: (orderData) => {
    const total = orderData.totalPrice || 0;
    const items = orderData.items?.length || 0;
    const address = orderData.customerInfo?.address || '';
    
    let riskLevel = 'low';
    let score = 0;
    let notes = [];

    if (total > 50000) {
      riskLevel = 'high';
      score += 3;
      notes.push('High value order - manual verification recommended');
    } else if (total > 20000) {
      riskLevel = 'medium';
      score += 2;
      notes.push('Medium value order');
    }

    if (items > 5) {
      score += 1;
      notes.push('Bulk order - verify stock availability');
    }

    if (!address || address.length < 10) {
      score += 1;
      notes.push('Incomplete address - verify with customer');
    }

    notes.push('New order from ' + (orderData.customerInfo?.city || 'Unknown city'));

    return {
      riskLevel,
      score,
      notes,
      recommendedAction: riskLevel === 'low' ? 'review' : riskLevel === 'medium' ? 'review' : 'manual-verify',
      estimatedDelivery: '3-5 working days',
      priority: score >= 3 ? 'high' : 'normal'
    };
  },

  generateConfirmationMessage: (orderId, orderData) => {
    const shortId = orderId.slice(0, 8).toUpperCase();
    const total = orderData.totalPrice?.toLocaleString() || '0';
    const items = orderData.items || [];
    
    let message = `🛍️ *NAZAAKAT - Order Confirmed!*\n\n`;
    message += `📦 Order: #${shortId}\n`;
    message += `✅ Status: Confirmed\n\n`;
    message += `👤 *Customer:* ${orderData.customerInfo?.name || 'Valued Customer'}\n`;
    message += `📱 Phone: ${orderData.customerInfo?.phone}\n`;
    message += `📍 ${orderData.customerInfo?.city}\n\n`;
    message += `📋 *Order Details:*\n`;
    
    items.forEach((item, i) => {
      message += `${i + 1}. ${item.title} x${item.quantity} - PKR ${(item.price * item.quantity).toLocaleString()}\n`;
    });
    
    message += `\n💰 *Total: PKR ${total}*\n`;
    message += `💳 Payment: ${orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : orderData.paymentMethod}\n\n`;
    message += `📞 Questions? Contact us on WhatsApp!\n`;
    message += `🙏 Thank you for shopping at NAZAAKAT!`;
    
    return message;
  }
};