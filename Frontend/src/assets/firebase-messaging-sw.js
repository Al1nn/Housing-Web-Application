// src/assets/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');


// Your Firebase configuration
const firebaseConfig = {
  projectId: 'myfirstapp-a15e1',
  appId: '1:859208953616:web:f9a1026cb308c49963bf95',
  databaseURL: 'https://myfirstapp-a15e1-default-rtdb.europe-west1.firebasedatabase.app',
  storageBucket: 'myfirstapp-a15e1.appspot.com',
  apiKey: 'AIzaSyAN3_n0tOjV_tJ37vc33Xpa9Kbr5ERSRGE',
  authDomain: 'myfirstapp-a15e1.firebaseapp.com',
  messagingSenderId: '859208953616',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();


