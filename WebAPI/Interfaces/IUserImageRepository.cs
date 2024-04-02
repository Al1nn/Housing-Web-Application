using System.Runtime.InteropServices;
using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IUserImageRepository
    {
         Task<User> Authenticate(string username, string password, List<string> roles);

        Task<User> GetUserByName(string username);

         void Register(string username, string password, string email, string phoneNumber, List<string> roles,string? imageUrl);

        Task<bool> UserAlreadyExists(string username);

        Task<UserImage> GetImageById(int id);

        Task<IEnumerable<UserImage>> GetUserCardsAsync();

        Task<UserImage> GetUserCardById(int id);
    }
}
