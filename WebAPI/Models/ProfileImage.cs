namespace WebAPI.Models
{
    public class ProfileImage : BaseEntity
    {
        public string ImageUrl { get; set; }

        public ICollection<UserProfileImage> UserProfileImages { get; set; }
    }
}
