using WebAPI.Models;

namespace WebAPI.Dtos
{
    public class LoginReqDto
    {
        public string Username { get; set; }

        public string Password { get; set; }

        public UserRole Role { get; set; }
    }
}
