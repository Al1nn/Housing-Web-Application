// src/assets/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');


// Your Firebase configuration
const firebaseConfig = {
  projectId: 'your_project_id',
  appId: 'your_app_id',
  databaseURL: 'your_database_url',
  storageBucket: 'your_storage_bucket',
  apiKey: 'your_google_api_key',
  authDomain: 'your_auth_domain',
  messagingSenderId: 'your_messaging_sender_id',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();


