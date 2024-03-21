using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class User : BaseEntity
    {
        
        [Required]
        public string Username { get; set; }

        [Required]
        public byte[] Password { get; set; }

        public byte[] PasswordKey { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public UserRole Role { get; set; }
    }
}
