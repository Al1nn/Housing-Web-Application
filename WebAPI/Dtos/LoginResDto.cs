using WebAPI.Models;

namespace WebAPI.Dtos
{
    public class LoginResDto
    {
        public string Username { get; set; }

        public string Token { get; set; }

        public UserRole Role { get; set; }
    }
}
