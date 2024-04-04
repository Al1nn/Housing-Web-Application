using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;
using WebAPI.Interfaces;
using WebAPI.Models;
using Image = WebAPI.Models.Image;

namespace WebAPI.Data.Repo
{
    public class UserImageRepository : IUserImageRepository
    {
        private readonly DataContext dc;

        public UserImageRepository(DataContext dc)
        {
            this.dc = dc;
        }

        public async Task<User> Authenticate(string username, string passwordText, List<string> roles)
        {


            var user =  await dc.Users.
                Include(r => r.Roles)
               .FirstOrDefaultAsync( data => data.Username == username);
            
            
            if (user == null || user.PasswordKey == null)
            {
                return null;
            }

            if (!MatchPasswordHash(passwordText, user.Password, user.PasswordKey))
            {
                return null;
            }

            if(roles.Count == 0)
            {
                return null;
            }

            if(roles.Any(role => user.Roles.All(userRole => userRole.Name != role)))
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

 

        public void Register(string username, string password, string email, string phoneNumber, List<string> roles ,IFormFile file)
        {
            byte[] passwordHash, passwordKey;

            using (var hmac = new HMACSHA512())
            {
                passwordKey = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
            
            User user = new User();
            user.Username = username;
            user.Password = passwordHash;
            user.PasswordKey = passwordKey;
            user.Email = email;
            user.PhoneNumber = phoneNumber;
            user.Roles = new List<Role>();
            

            foreach (var userRole in roles) {
                var role = new Role
                {
                    LastUpdatedOn = DateTime.Now,
                    UserId = user.Id,
                    Name = userRole,
                    LastUpdatedBy = user.LastUpdatedBy
                };
                user.Roles.Add(role);   
            }

            if (file != null)
            {
                //Include file in original and thumbnail directory;
                string originalSizesDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UPLOADS", "originalSizes");
                string thumbnailsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UPLOADS", "thumbnails");

                if (!Directory.Exists(originalSizesDirectory))
                {
                    Directory.CreateDirectory(originalSizesDirectory);
                }

                if (!Directory.Exists(thumbnailsDirectory))
                {
                    Directory.CreateDirectory(thumbnailsDirectory);
                }

                string uniqueId = Guid.NewGuid().ToString();
                var fileName = uniqueId + '-' + file.FileName;

                var originalPath = Path.Combine(originalSizesDirectory, fileName);
                var thumbnailPath = Path.Combine(thumbnailsDirectory, fileName);

                using (var stream = new FileStream(originalPath, FileMode.Create))
                {
                    file.CopyToAsync(stream);
                }

                using (var thumbnail = SixLabors.ImageSharp.Image.Load(originalPath))
                {
                    var resizeOptions = new ResizeOptions
                    {
                        Mode = ResizeMode.Max,
                        Size = new Size(250, 250),
                        Position = AnchorPositionMode.Center
                    };

                    thumbnail.Mutate(x => x.Resize(resizeOptions));
                    thumbnail.Save(thumbnailPath);
                }

                Image image = new Image();

                image.FileName = fileName;

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
