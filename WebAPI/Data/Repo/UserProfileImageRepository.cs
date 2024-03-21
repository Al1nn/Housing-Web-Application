using Microsoft.EntityFrameworkCore;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Data.Repo
{
    public class UserProfileImageRepository : IUserProfileImageRepository
    {
        private readonly DataContext dc;

        public UserProfileImageRepository(DataContext dc)
        {
            this.dc = dc;
        }

        public async Task<UserProfileImage> GetUserProfileImageById(int userId)
        {
            /*
             var properties = await dc.Properties
                            .Include(p => p.Photos)
                            .Where(p => p.Id == id)
                            .FirstOrDefaultAsync();
                return properties;
             */
            var userProfileImage =await dc.UserProfiles
                                .Include(u => u.User)
                                .Include(u => u.ProfileImage)
                                .Where(u => u.UserId == userId)
                                .FirstOrDefaultAsync();
                                    
            return userProfileImage;
        }

        public async Task<IEnumerable<UserProfileImage>> GetUserProfileImages()
        {
            var userProfileImages = await dc.UserProfiles
                .Include(u => u.User)
                .Include(u => u.ProfileImage)
                .ToListAsync();
            return userProfileImages;
        }
    }
}
