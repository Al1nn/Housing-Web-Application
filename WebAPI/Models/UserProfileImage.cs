namespace WebAPI.Models
{
    public class UserProfileImage
    {
        public int UserId { get; set; }

        public virtual User User { get; set; }

        public int ProfileImageId { get; set; }

        public virtual ProfileImage ProfileImage { get; set; }
    }
}
