using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        public string Photo {  get; set; }

        public ICollection<Role> Roles { get; set; }
    }
}
