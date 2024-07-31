using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Dtos
{

    public class PropertyStatsDto
    {
        public int Id { get; set; }

        public string City { get; set; }

        public string Country { get; set; }

        public int SellCount { get; set; }

        public int RentCount { get; set; }
    }
}
