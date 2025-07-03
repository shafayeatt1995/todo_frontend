// composables/useNotifications.ts
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyArZEYMvNOx5vgDhNzqtYizIW1FkeFRqcA",
  authDomain: "bibong-8c26d.firebaseapp.com",
  projectId: "bibong-8c26d",
  storageBucket: "bibong-8c26d.firebasestorage.app",
  messagingSenderId: "10661873396",
  appId: "1:10661873396:web:28317b20256611cb0900a1",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const useNotifications = () => {
  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Notification permission not granted");
    }

    const token = await getToken(messaging, {
      vapidKey:
        "BL1lAlgNOaY7TTz6IgB3cHGSsIG6sS7UqGI7D74zxzg5_4cfaPplcfQBd9ERuyEtcN3jmfVhRMqnYl8nOwdKrZc",
    });

    return token;
  };

  const listenForeground = () => {
    onMessage(messaging, (payload) => {
      console.log("🔥 Foreground message:", payload);
      alert(payload.notification?.title || "New message!");
    });
  };

  return { requestPermission, listenForeground };
};
