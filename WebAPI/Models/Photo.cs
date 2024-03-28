using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    [Table("Photos")]
    public class Photo : BaseEntity
    {
        public string FileName { get; set; }

        public int PropertyId { get; set; }

        public Property Property { get; set; }
    }
}