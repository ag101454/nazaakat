import emailjs from '@emailjs/browser';

// Sign up free at https://emailjs.com
const SERVICE_ID = 'service_xxxxxx';
const TEMPLATE_ID = 'template_xxxxxx';
const PUBLIC_KEY = 'xxxxxxxxxxxxxxx';

let isInitialized = false;

export const initEmailJS = () => {
  if (!isInitialized) {
    emailjs.init(PUBLIC_KEY);
    isInitialized = true;
  }
};

export const sendOrderEmailToAdmin = async (orderData) => {
  try {
    initEmailJS();
    
    const templateParams = {
      to_name: 'NAZAAKAT Admin',
      to_email: 'hello@nazaakat.com',
      customer_name: orderData.customerInfo?.name || 'N/A',
      customer_phone: orderData.customerInfo?.phone || 'N/A',
      customer_city: orderData.customerInfo?.city || 'N/A',
      customer_address: orderData.customerInfo?.address || 'N/A',
      order_total: `PKR ${(orderData.totalPrice || 0).toLocaleString()}`,
      order_items: orderData.items?.map(i => `${i.title} x${i.quantity}`).join(', ') || 'N/A',
      order_id: orderData.orderId?.slice(0, 8) || 'N/A',
      payment_method: orderData.paymentMethod || 'N/A',
      order_date: new Date().toLocaleDateString('en-PK'),
    };

    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    console.log('📧 Email sent to admin');
  } catch (error) {
    console.error('Email error (non-critical):', error.message);
  }
};