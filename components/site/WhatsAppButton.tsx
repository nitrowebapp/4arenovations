const WHATSAPP_URL =
  "https://wa.me/14072279908?text=" +
  encodeURIComponent("Hi! I'd like a flooring estimate. / Olá! Gostaria de um orçamento de piso.");

export function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.6 6L4 29l8.2-1.5c1.7.9 3.7 1.5 5.8 1.5 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 22c-1.8 0-3.5-.5-5-1.4l-.4-.2-4.4.8.9-4.2-.3-.4C5.7 18.1 5.2 16.6 5.2 15 5.2 9 10 4.2 16 4.2S26.8 9 26.8 15 22 25 16 25zm5.6-7.2c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-.9 1.2-.3.2-.6.1c-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1s0-.5.1-.6c.1-.1.3-.3.4-.5.2-.2.2-.3.3-.5s.1-.4 0-.5c-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.4z" />
    </svg>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl transition hover:scale-105 hover:bg-green-600"
    >
      <WhatsAppIcon size={28} />
    </a>
  );
}

export function WhatsAppLink({ label }: { label: string }) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-600"
    >
      <WhatsAppIcon size={18} />
      {label}
    </a>
  );
}
