using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    public class Image : BaseEntity
    {
        public string FileName { get; set; }


        public ICollection<UserImage> Users { get; set; }

       
    }
}
