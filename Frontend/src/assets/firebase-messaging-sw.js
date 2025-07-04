// src/assets/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');


// Your Firebase configuration
const firebaseConfig = { "projectId": "bla", "appId": "bla", "databaseURL": "bla", "storageBucket": "bla", "apiKey": "bla", "authDomain": "bla", "messagingSenderId": "bla" };

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();


