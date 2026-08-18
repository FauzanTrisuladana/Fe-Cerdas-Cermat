import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { env } from "@/env";

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<'pusher'>;
  }
}

let echoInstance: Echo<'pusher'> | null = null;

export const getEcho = (): Echo<'pusher'> | null => {
  // Cegah eksekusi di environment SSR
  if (typeof window === 'undefined') return null;

  if (!echoInstance) {
    window.Pusher = Pusher;

    echoInstance = new Echo({
      broadcaster: 'pusher',
      key: env.VITE_PUSHER_APP_KEY,
      cluster: env.VITE_PUSHER_APP_CLUSTER,
      forceTLS: true,
    });
  }

  return echoInstance;
};