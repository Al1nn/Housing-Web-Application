namespace WebAPI.Interfaces
{
    public interface INotificationService
    {

        Task SendNotificationAsync(string registrationToken, string lastMessage, string senderName, string senderPhoto);

        Task GetChatDataAsync(string chatId);
    }
}
