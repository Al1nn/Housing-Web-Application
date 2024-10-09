// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.5.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.5.2/firebase-messaging-compat.js')


// Initialize Firebase
firebase.initializeApp({
    "projectId": "myfirstapp-a15e1",
    "appId": "1:859208953616:web:f9a1026cb308c49963bf95",
    "databaseURL": "https://myfirstapp-a15e1-default-rtdb.europe-west1.firebasedatabase.app",
    "storageBucket": "myfirstapp-a15e1.appspot.com",
    "apiKey": "AIzaSyAN3_n0tOjV_tJ37vc33Xpa9Kbr5ERSRGE",
    "authDomain": "myfirstapp-a15e1.firebaseapp.com",
    "messagingSenderId": "859208953616" 
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message: ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'favicon.ico' // Specify the icon path if needed
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});
