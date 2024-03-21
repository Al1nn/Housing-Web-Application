namespace WebAPI.Models
{
    public class UserProfileImage
    {
        public int UserId { get; set; }

        public  User User { get; set; }

        public int ProfileImageId { get; set; }

        public ProfileImage ProfileImage { get; set; }
    }
}
