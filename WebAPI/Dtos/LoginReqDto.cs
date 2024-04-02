using System.Runtime.InteropServices;
using WebAPI.Models;

namespace WebAPI.Dtos
{
    public class LoginReqDto
    {
        public string Username { get; set; }

        public string Password { get; set; }
      
        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public List<string> Roles { get; set; }

        public string imageUrl { get; set; } = null!;
    }
}
