using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Data.Repo
{
    public class UserImageRepository : IUserImageRepository
    {
        private readonly DataContext dc;

        public UserImageRepository(DataContext dc)
        {
            this.dc = dc;
        }

        public async Task<User> Authenticate(string username, string passwordText, UserRole role)
        {


            var user =  await dc.Users.FirstOrDefaultAsync( data => data.Username == username);
           

            if (user == null || user.PasswordKey == null)
            {
                return null;
            }

            if (!MatchPasswordHash(passwordText, user.Password, user.PasswordKey))
            {
                return null;
            }

            if(user.Role != role)
            {
                return null;
            }

            return user;
            
        }

        private bool MatchPasswordHash(string passwordText, byte[] password, byte[] passwordKey)
        {

            using (var hmac = new HMACSHA512(passwordKey))
            {  
               var  passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(passwordText));

                for (int i = 0; i < passwordHash.Length; i++)
                {
                    if (passwordHash[i] != password[i])
                       return false;
                }
                return true;
            }

        }

 

        public void Register(string username, string password, string email, string phoneNumber,string? imageUrl)
        {
            byte[] passwordHash, passwordKey;

            using (var hmac = new HMACSHA512())
            {
                passwordKey = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }

            var count =  dc.Users.Count();
            
            User user = new User();
            user.Username = username;
            user.Password = passwordHash;
            user.PasswordKey = passwordKey;
            user.Email = email;
            user.PhoneNumber = phoneNumber; 

            if(count == 0)
            {
                user.Role = UserRole.UserEditor;
            }
            else
            {
                user.Role = UserRole.UserReader;
            }

            
            
            if (!imageUrl.IsNullOrEmpty())
            {
                Image image = new Image();
                image.Name = user.Username + '-' + user.Id.ToString() + ".jpg";
                image.Url = imageUrl;

                UserImage userImage = new UserImage
                {
                    User = user,
                    Image = image,
                };

                dc.UserImages.Add(userImage);
            }
            else
            {
                dc.Users.Add(user);
            }
           
        }

        public async Task<bool> UserAlreadyExists(string username)
        {
            return await dc.Users.AnyAsync( data => data.Username == username );
        }

        public async Task<User> GetUserByName(string username )
        {
            return await dc.Users.FirstOrDefaultAsync(data => data.Username == username);
        }

        public async Task<IEnumerable<UserImage>> GetUserCardsAsync()
        {
            return await dc.Users
                    .GroupJoin(
                        dc.UserImages,
                        user => user.Id,
                        userImage => userImage.UserId,
                        (user, userImages) => new { User = user, UserImages = userImages }
                    )
                    .SelectMany(
                        x => x.UserImages.DefaultIfEmpty(),
                        (x, userImage) => new UserImage { User = x.User, Image = userImage != null ? userImage.Image : null }
                    )
                    .ToListAsync();
        }

        public async Task<UserImage> GetUserCardById(int id)
        {
            var userImage = await dc.Users
                    .Where(u => u.Id == id)
                    .GroupJoin(
                        dc.UserImages,
                        user => user.Id,
                        userImage => userImage.UserId,
                        (user, userImages) => new { User = user, UserImages = userImages }
                    )
                    .SelectMany(
                        x => x.UserImages.DefaultIfEmpty(),
                        (x, userImage) => new UserImage { User = x.User, Image = userImage != null ? userImage.Image : null }
                    )
                    .FirstOrDefaultAsync();

            return userImage;
        }

        public async Task<UserImage> GetImageById(int id)
        {
            var image = await dc.UserImages
                        .Include(x => x.Image)
                        .Where(x => x.UserId == id)
                        .FirstOrDefaultAsync() ;
            return image;
        }

     
    }
}
