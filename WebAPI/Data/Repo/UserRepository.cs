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
    public class UserRepository : IUserRepository
    {
        private readonly DataContext dc;

        public UserRepository(DataContext dc)
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

 

        public void Register(string username, string password, string email, string phoneNumber, [Optional] string imageUrl )
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
             
           
            dc.Users.Add(user);

            if(!imageUrl.IsNullOrEmpty())
            {
                ProfileImage profileImage = new ProfileImage();
                
                profileImage.ImageUrl = imageUrl;
                profileImage.LastUpdatedBy = user.LastUpdatedBy;
                dc.ProfileImages.Add(profileImage);


                UserProfileImage userProfileImage = new UserProfileImage { User = user, ProfileImage = profileImage};
                dc.UserProfiles.Add(userProfileImage);
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

        
    }
}
