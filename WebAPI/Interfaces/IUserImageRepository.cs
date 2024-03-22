using System.Runtime.InteropServices;
using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IUserImageRepository
    {
         Task<User> Authenticate(string username, string password, UserRole role);
         
         Task<User> GetUserByName(string username);

         void Register(string username, string password, string email, string phoneNumber,[Optional] IFormFile imageFile);

        Task<bool> UserAlreadyExists(string username);

        Task<IEnumerable<UserImage>> GetUserImagesAsync();

        Task<UserImage> GetUserImageById(int id);
    }
}
