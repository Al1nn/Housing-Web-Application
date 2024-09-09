namespace WebAPI.Models
{
    public class BaseEntity
    {
        public int Id { get; set; }
        
        public DateTime LastUpdatedOn { get; set; }

        public int LastUpdatedBy { get; set; } = 0;

    }

}
