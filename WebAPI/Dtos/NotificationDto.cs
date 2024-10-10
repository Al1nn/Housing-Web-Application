namespace WebAPI.Dtos
{
    public class NotificationDto
    {
        public string Token { get; set; }

        public string SenderId { get; set; }

        public string SenderName { get; set; }

        public string SenderPhoto { get; set; }

        public string LastMessage { get; set; }
    }
}
