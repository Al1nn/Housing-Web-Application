using WebAPI.Models;

namespace WebAPI.Dtos
{
    public class UserImageDto
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public int ImageId { get; set; }

        public string FileName { get; set; }

    }
}
