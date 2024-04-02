using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    [Table("Roles")]
    public class Role : BaseEntity
    {
        public string Name { get; set; }

        public int UserId { get; set; }

        public User User { get; set; }

    }
}
