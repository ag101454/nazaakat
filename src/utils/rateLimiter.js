const orderTimestamps = {};

export const checkRateLimit = (phone) => {
  if (!phone) return { allowed: true };
  
  const now = Date.now();
  const lastOrder = orderTimestamps[phone];
  
  if (lastOrder && (now - lastOrder) < 300000) {
    const minutesLeft = Math.ceil((300000 - (now - lastOrder)) / 60000);
    return {
      allowed: false,
      message: `Please wait ${minutesLeft} minute(s) before placing another order.`
    };
  }
  
  orderTimestamps[phone] = now;
  return { allowed: true };
};