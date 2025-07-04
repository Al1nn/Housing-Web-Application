using System.Runtime.InteropServices;
using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IUserRepository
    {
        Task<User> Authenticate(string username, string password, List<string> roles);

        void Register(string username, string password, string email, string phoneNumber, List<string> roles,IFormFile? file);

        Task<bool> VerifyOldPassword(int id, string password);

        Task<bool> UserAlreadyExists(string username);

        Task<User> GetUserById(int id);
        
        Task<int> GetAdminCountAsync();
        void EncryptPassword(string password, out byte[] passwordHash, out byte[] passwordKey);

        void UpdateUser(User user);

        void DeleteUser(User user);

        Task<IEnumerable<User>> GetOtherUsersAsync(int currentId);
        
        
    }
}
