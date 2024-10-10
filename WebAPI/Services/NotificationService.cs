using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;
using Newtonsoft.Json;
using System.Text.RegularExpressions;
using WebAPI.Interfaces;

namespace WebAPI.Services
{
    public class NotificationService : INotificationService
    {
        private readonly FirebaseMessaging _firebaseMessaging;

        public NotificationService()
        {
            if(FirebaseApp.DefaultInstance == null)
            {
                FirebaseApp.Create(new AppOptions
                {
                    Credential = GoogleCredential.FromFile("myfirstapp-a15e1-firebase-adminsdk-f5aua-db7a2fac1b.json")
                });
            }
            _firebaseMessaging = FirebaseMessaging.DefaultInstance;
            
        }

        
        public async Task SendNotificationAsync(string token, string senderId, string lastMessage, string senderName, string senderPhoto)
        {
            await _firebaseMessaging.SubscribeToTopicAsync(new List<string> { token }, "notifications");
            
           
            var message = new Message()
            {
                Topic = "notifications",
                Notification = new Notification
                {
                    Title = $"New message from {senderName}",
                    Body = lastMessage,
                    //ImageUrl = "http://localhost:5207/UPLOADS/thumbnails/" + senderPhotoUrl 
                },
                Data = new Dictionary<string, string>()
            {
                { "senderId", senderId },        
                { "senderName", senderName },
                { "lastMessage", lastMessage },
                { "senderPhotoUrl", senderPhoto }
            }
            };

            
            string response = await _firebaseMessaging.SendAsync(message);
           
            Console.WriteLine("Successfully sent notification: " + response);
        }



        //https://myfirstapp-a15e1-default-rtdb.europe-west1.firebasedatabase.app/chats/{chatId}.json


        
    }
}
