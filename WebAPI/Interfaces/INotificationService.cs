namespace WebAPI.Interfaces
{
    public interface INotificationService
    {

        Task SendNotificationAsync(string token, string senderId, string lastMessage, string senderName, string senderPhoto);

    }
}
