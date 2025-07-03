importScripts(
  "https://www.gstatic.com/firebasejs/10.3.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.3.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyArZEYMvNOx5vgDhNzqtYizIW1FkeFRqcA",
  authDomain: "bibong-8c26d.firebaseapp.com",
  projectId: "bibong-8c26d",
  storageBucket: "bibong-8c26d.firebasestorage.app",
  messagingSenderId: "10661873396",
  appId: "1:10661873396:web:28317b20256611cb0900a1",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(({ notification }) => {
  self.registration.showNotification(notification.title, {
    body: notification.body,
    icon: "/icon.png",
  });
});
