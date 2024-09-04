namespace WebAPI.Models
{
    public class Currency
    {
        public int Id { get; set; }

        public string Name {  get; set; }

        public decimal Value { get; set; }

        public DateTime AddedOn { get; set; } = DateTime.Now;
    }
}
