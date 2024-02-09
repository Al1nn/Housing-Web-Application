using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IUserRepository
    {
        public Task<User> Authenticate(string username, string password);


    }
}
