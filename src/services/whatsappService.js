// WhatsApp messaging service for NAZAAKAT

const WHATSAPP_NUMBER = '923407146871';
const STORE_NAME = 'NAZAAKAT';

// Format phone number for WhatsApp
const formatPhone = (phone) => {
  if (!phone) return null;
  
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, '');
  
  // Remove leading zeros
  cleaned = cleaned.replace(/^0+/, '');
  
  // Add Pakistan code if not present
  if (cleaned.length === 10 && !cleaned.startsWith('92')) {
    cleaned = '92' + cleaned;
  }
  
  console.log('Formatted phone:', cleaned);
  return cleaned;
};

// Generate order accepted message
export const generateAcceptedMessage = (order) => {
  const orderId = order.id?.slice(0, 8).toUpperCase() || 'N/A';
  const customerName = order.customerInfo?.name || 'Valued Customer';
  const total = order.totalPrice?.toLocaleString() || '0';
  const items = order.items || [];
  const paymentMethod = order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                        order.paymentMethod === 'sadapay' ? 'SadaPay' :
                        order.paymentMethod === 'jazzcash' ? 'JazzCash' : 'Bank Transfer';

  let message = `🌟 *ORDER CONFIRMED!* 🌟\n\n`;
  message += `Dear *${customerName}*,\n\n`;
  message += `Your order has been *ACCEPTED* and is now being processed! 🎉\n\n`;
  message += `📦 *Order ID:* #${orderId}\n`;
  message += `💰 *Total:* PKR ${total}\n`;
  message += `💳 *Payment:* ${paymentMethod}\n\n`;
  message += `📋 *Your Items:*\n`;
  
  items.forEach((item, i) => {
    message += `  ${i + 1}. ${item.title} x${item.quantity}\n`;
  });
  
  message += `\n📞 *Delivery Address:*\n`;
  message += `${order.customerInfo?.address || 'N/A'}\n`;
  message += `${order.customerInfo?.city || 'N/A'}\n\n`;
  message += `🚚 *Estimated Delivery:* 3-5 Working Days\n\n`;
  message += `📱 We'll update you via WhatsApp when your order ships!\n\n`;
  message += `Thank you for choosing *${STORE_NAME}*! 💎\n`;
  message += `_Elegance in Every Detail_ ✨`;

  return message;
};

// Generate order rejected message
export const generateRejectedMessage = (order) => {
  const orderId = order.id?.slice(0, 8).toUpperCase() || 'N/A';
  const customerName = order.customerInfo?.name || 'Valued Customer';
  const total = order.totalPrice?.toLocaleString() || '0';

  let message = `😔 *Order Update - ${STORE_NAME}*\n\n`;
  message += `Dear *${customerName}*,\n\n`;
  message += `Unfortunately, your order *#${orderId}* (PKR ${total}) could not be processed at this time.\n\n`;
  message += `This may be due to:\n`;
  message += `• Item out of stock\n`;
  message += `• Delivery not available in your area\n`;
  message += `• Payment verification issue\n\n`;
  message += `💬 *Don't worry!* Contact us on WhatsApp for:\n`;
  message += `• Alternative products\n`;
  message += `• Refund information (if paid)\n`;
  message += `• Any other questions\n\n`;
  message += `📞 WhatsApp: +${WHATSAPP_NUMBER}\n\n`;
  message += `We apologize for the inconvenience and hope to serve you soon! 🙏\n`;
  message += `_${STORE_NAME} - Elegance in Every Detail_ ✨`;

  return message;
};

// Send WhatsApp message
export const sendWhatsAppToCustomer = (phone, message) => {
  const formattedPhone = formatPhone(phone);
  
  if (!formattedPhone) {
    console.error('Invalid phone number:', phone);
    return false;
  }

  console.log('Sending WhatsApp to:', formattedPhone);
  console.log('Message:', message);

  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  
  console.log('WhatsApp URL:', whatsappUrl);
  
  // Open WhatsApp - use multiple methods to ensure it works
  try {
    // Method 1: Direct window open
    const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    // Method 2: If popup blocked, use link click
    if (!newWindow || newWindow.closed) {
      const link = document.createElement('a');
      link.href = whatsappUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    return true;
  } catch (error) {
    console.error('Error opening WhatsApp:', error);
    return false;
  }
};

// Handle order status change
export const handleOrderNotification = (order, newStatus) => {
  const customerPhone = order.customerInfo?.phone || order.customerInfo?.whatsapp;
  
  console.log('=== ORDER NOTIFICATION ===');
  console.log('Order ID:', order.id);
  console.log('Customer Phone:', customerPhone);
  console.log('New Status:', newStatus);
  
  if (!customerPhone) {
    console.error('❌ No customer phone number found');
    alert('No customer phone number found!');
    return false;
  }

  let message = '';
  
  if (newStatus === 'accepted') {
    message = generateAcceptedMessage(order);
  } else if (newStatus === 'rejected') {
    message = generateRejectedMessage(order);
  }

  if (message) {
    const sent = sendWhatsAppToCustomer(customerPhone, message);
    if (sent) {
      console.log('✅ WhatsApp message sent!');
      return true;
    } else {
      console.error('❌ Failed to send WhatsApp message');
      return false;
    }
  }

  return false;
};