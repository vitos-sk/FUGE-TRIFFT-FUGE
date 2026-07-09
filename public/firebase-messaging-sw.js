importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyD6ZrT1Oy-LpfRLLx5Q10s7Lf2MF5AZB14",
  authDomain: "fuge-trifft-fuge.firebaseapp.com",
  projectId: "fuge-trifft-fuge",
  storageBucket: "fuge-trifft-fuge.firebasestorage.app",
  messagingSenderId: "1068777151461",
  appId: "1:1068777151461:web:9238a38d6e8594be5bad0c",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.data ?? {};
  if (title) {
    self.registration.showNotification(title, {
      body,
      icon: "/apple-touch-icon.png",
      badge: "/apple-touch-icon.png",
    });
  }
});
