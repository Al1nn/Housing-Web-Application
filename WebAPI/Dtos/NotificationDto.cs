namespace WebAPI.Dtos
{
    public class NotificationDto
    {
        public string registrationToken { get; set; }

        public string senderName { get; set; }

        public string senderPhoto { get; set; }

        public string lastMessage { get; set; }
    }
}
