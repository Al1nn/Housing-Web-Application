using System.Runtime.InteropServices;
using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IUserImageRepository
    {
        Task<User> Authenticate(string username, string password, List<string> roles);

        void Register(string username, string password, string email, string phoneNumber, List<string> roles,IFormFile? file);


        Task<bool> VerifyOldPassword(int id, string password);

        Task<bool> UserAlreadyExists(string username);

        Task<User> GetUserById(int id);

        void EncryptPassword(string password, out byte[] passwordHash, out byte[] passwordKey);

        void UpdatePassword(User user);

        void UpdateAvatar(Image image);

        Task<Image> GetAvatarByFileName(string fileName);

        Task<UserImage> GetImageById(int id);

        void AddUserAvatar(UserImage image);

        Task<IEnumerable<UserImage>> GetUserCardsAsync();

        Task<UserImage> GetUserCardById(int id);
    }
}
