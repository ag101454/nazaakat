import { MessageCircle } from 'lucide-react';

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/923001234567?text=I'm%20interested%20in%20NAZAKKAT%20products"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 text-white rounded-full 
               flex items-center justify-center shadow-lg hover:bg-green-600 transition-all
               hover:scale-110"
    >
      <MessageCircle size={28} />
    </a>
  );
}

export default WhatsAppButton;