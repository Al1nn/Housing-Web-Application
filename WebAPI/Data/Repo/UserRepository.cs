using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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

        public void Register(string username, string password)
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

            if(count == 0)
            {
                user.Role = UserRole.UserEditor;
            }
            else
            {
                user.Role = UserRole.UserReader;
            }
             
           
            dc.Users.Add(user);
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
