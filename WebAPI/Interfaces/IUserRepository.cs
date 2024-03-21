using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IUserRepository
    {
         Task<User> Authenticate(string username, string password, UserRole role);
         
         Task<User> GetUserByName(string username);

         void Register(string username, string password, string email, string phoneNumber);

        Task<bool> UserAlreadyExists(string username);
    }
}
