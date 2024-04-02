using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    public class Image : BaseEntity
    {
        public string Name { get; set; }

        public string Url { get; set; }


        public ICollection<UserImage> Users { get; set; }

       
    }
}
