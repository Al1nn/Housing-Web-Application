using WebAPI.Models;

namespace WebAPI.Dtos
{
    public class PropertyDetailDto : PropertyListDto
    {
        public int CarpetArea { get; set; }
        public string Address { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string PhoneNumber { get; set; }
        public int FloorNo { get; set; }
        public int TotalFloors { get; set; }
        public string MainEntrance { get; set; }
        public int Security { get; set; }
        public bool Gated { get; set; }
        public int Maintenance { get; set; }
        public string Description { get; set; }
        public int PostedBy { get; set; }
     
        public ICollection<PhotoDto> Photos { get; set; }

        public int Likes { get; set; }
    }
}