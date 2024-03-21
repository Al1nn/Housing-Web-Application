using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IUserProfileImageRepository
    {
        Task<UserProfileImage> GetUserProfileImageById(int userId);

        Task<IEnumerable<UserProfileImage>> GetUserProfileImages();
    }
}
