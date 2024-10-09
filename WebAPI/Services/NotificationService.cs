using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;
using Newtonsoft.Json;
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

        

        public async Task SendNotificationAsync(string registrationToken, string lastMessage, string senderName, string senderPhoto)
        {
            // Prepare FCM message
            var message = new Message()
            {
                Token = registrationToken, 
                Notification = new Notification
                {
                    Title = $"New message from {senderName}",
                    Body = lastMessage,
                    //ImageUrl = "http://localhost:5207/UPLOADS/thumbnails/" + senderPhotoUrl 
                },
                Data = new Dictionary<string, string>()
            {
                { "senderName", senderName },
                { "lastMessage", lastMessage },
                { "senderPhotoUrl", senderPhoto }
            }
            };

            // Send the message
            string response = await _firebaseMessaging.SendAsync(message);
            Console.WriteLine("Successfully sent notification: " + response);
        }



        //https://myfirstapp-a15e1-default-rtdb.europe-west1.firebasedatabase.app/chats/{chatId}.json

        public async Task GetChatDataAsync(string chatId)
        {
            var client = new HttpClient();
            var response = await client.GetStringAsync($"https://myfirstapp-a15e1-default-rtdb.europe-west1.firebasedatabase.app/chats/{chatId}.json");

         
            dynamic chatData = JsonConvert.DeserializeObject(response);

            string receiverId = chatData.receiverID;
            string lastMessage = chatData.lastMessage;
            string senderName = chatData.senderName;
            string senderPhotoUrl = chatData.senderPhoto;

            // Send push notification using the retrieved data
            await SendNotificationAsync(receiverId, lastMessage, senderName, senderPhotoUrl);
        }



    }
}
