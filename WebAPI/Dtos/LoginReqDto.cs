using WebAPI.Models;

namespace WebAPI.Dtos
{
    public class LoginReqDto
    {
        public string Username { get; set; }

        public string Password { get; set; }

        public UserRole Role { get; set; }
        
        
        public string Email { get; set; }

        public string PhoneNumber { get; set; }
    }
}
