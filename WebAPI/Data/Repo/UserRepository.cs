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

namespace WebAPI.Data.Repo
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext dc;

        public UserRepository(DataContext dc)
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

            if(user.Roles.Count == 0)
            {
                return null;
            }

            if(roles.Any(role => user.Roles.All(userRole => userRole.Name != role)))
            {
                return null;
            }

         
            return user;
            
        }

        public async Task<User> GetUserById(int id)
        {
            return await dc.Users
                .Include(r => r.Roles)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<IEnumerable<User>> GetOtherUsersAsync(int currentId)
        {
            return await dc.Users
                .Include(r => r.Roles)
                .Where( dc => dc.Id != currentId )
                .ToListAsync();
        }


        public async Task<bool> VerifyOldPassword(int id, string password)
        {
            var user = await GetUserById(id);

            return MatchPasswordHash(password, user.Password, user.PasswordKey);

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

        public void EncryptPassword(string password, out byte[] passwordHash, out byte[] passwordKey)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordKey = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }


        public void UpdateUser(User user)
        {
            dc.Users.Update(user);
        }

        public void DeleteUser(User user)
        {
            dc.Users.Remove(user);
        }

        public void Register(string username, string password, string email, string phoneNumber, List<string> roles ,IFormFile file)
        {
            byte[] passwordHash, passwordKey;

            EncryptPassword(password, out passwordHash, out passwordKey);
            
            User user = new User();
            user.Username = username;
            user.Password = passwordHash;
            user.PasswordKey = passwordKey;
            user.Email = email;
            user.PhoneNumber = phoneNumber;
            user.Roles = new List<Role>();
            user.Photo = "";

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
                    file.CopyTo(stream);
                }

                using (var thumbnail = Image.Load(originalPath))
                {
                    var resizeOptions = new ResizeOptions
                    {
                        Mode = ResizeMode.Crop,
                        Size = new Size(250, 250),
                        Position = AnchorPositionMode.Center
                    };

                    thumbnail.Mutate(x => x.Resize(resizeOptions));
                    thumbnail.Save(thumbnailPath);
                }

                user.Photo = fileName;
                
            }
          
            dc.Users.Add(user);
        }

        public async Task<bool> UserAlreadyExists(string username)
        {
            return await dc.Users.AnyAsync( data => data.Username == username );
        }

    }
}
