using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    [Table("PropertyLikes")]
    public class PropertyLike : BaseEntity
    {
        public int PropertyId { get; set; }

        public Property Property { get; set; }

        public int LikedBy { get; set; }
    }
}
