import { collection, addDoc, updateDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';

// AI Agent for order automation
export const AIAgent = {
  // Process new order
  processOrder: async (orderData) => {
    try {
      // Save order to Firestore
      const orderRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        status: 'pending',
        aiProcessed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: [{
          status: 'Order Placed',
          time: new Date().toISOString(),
          message: 'Customer placed order via website'
        }]
      });

      // AI auto-analysis
      const analysis = AIAgent.analyzeOrder(orderData);
      
      // Update order with AI insights
      await updateDoc(doc(db, 'orders', orderRef.id), {
        aiAnalysis: analysis,
        aiProcessed: true,
      });

      // Auto-accept if low risk
      if (analysis.riskLevel === 'low' && orderData.paymentMethod === 'cod') {
        await AIAgent.autoAcceptOrder(orderRef.id, orderData);
      }

      return {
        orderId: orderRef.id,
        analysis,
        autoAccepted: analysis.riskLevel === 'low'
      };
    } catch (error) {
      console.error('AI Agent error:', error);
      throw error;
    }
  },

  // Analyze order for risk
  analyzeOrder: (orderData) => {
    const total = orderData.totalPrice || 0;
    const items = orderData.items?.length || 0;
    const phone = orderData.customerInfo?.phone || '';
    const address = orderData.customerInfo?.address || '';
    
    let riskLevel = 'low';
    let score = 0;
    let notes = [];

    // High value check
    if (total > 50000) {
      riskLevel = 'high';
      score += 3;
      notes.push('High value order - manual verification recommended');
    } else if (total > 20000) {
      riskLevel = 'medium';
      score += 2;
      notes.push('Medium value order');
    }

    // Multiple items
    if (items > 5) {
      score += 1;
      notes.push('Bulk order - verify stock availability');
    }

    // First time customer (you can expand this)
    notes.push('New order from ' + (orderData.customerInfo?.city || 'Unknown city'));

    // Address validation
    if (!address || address.length < 10) {
      score += 1;
      notes.push('Incomplete address - verify with customer');
    }

    return {
      riskLevel,
      score,
      notes,
      recommendedAction: riskLevel === 'low' ? 'auto-accept' : riskLevel === 'medium' ? 'review' : 'manual-verify',
      estimatedDelivery: '3-5 working days',
      priority: score >= 3 ? 'high' : 'normal'
    };
  },

  // Auto accept low-risk orders
  autoAcceptOrder: async (orderId, orderData) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'accepted',
        autoAccepted: true,
        updatedAt: new Date().toISOString(),
        timeline: [{
          status: 'Order Accepted',
          time: new Date().toISOString(),
          message: 'Auto-accepted by AI Agent'
        }]
      });

      // Generate confirmation message
      const confirmationMessage = AIAgent.generateConfirmationMessage(orderId, orderData);
      
      // Store confirmation
      await updateDoc(doc(db, 'orders', orderId), {
        confirmationMessage,
        whatsappSent: false
      });

      return true;
    } catch (error) {
      console.error('Auto-accept error:', error);
      return false;
    }
  },

  // Generate WhatsApp confirmation message
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
  },

  // Generate order notification for admin
  generateAdminNotification: (orderId, orderData, analysis) => {
    const shortId = orderId.slice(0, 8).toUpperCase();
    const total = orderData.totalPrice?.toLocaleString() || '0';
    
    let message = `🔔 *NEW ORDER ALERT*\n\n`;
    message += `📦 Order #${shortId}\n`;
    message += `👤 ${orderData.customerInfo?.name}\n`;
    message += `💰 PKR ${total}\n`;
    message += `🏷️ Risk: ${analysis.riskLevel?.toUpperCase()}\n`;
    message += `💡 Action: ${analysis.recommendedAction}\n\n`;
    message += `📝 ${analysis.notes?.join('\n')}\n\n`;
    message += `🔗 View in Admin Panel`;
    
    return message;
  }
};