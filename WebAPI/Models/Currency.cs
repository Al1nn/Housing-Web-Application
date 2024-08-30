namespace WebAPI.Models
{
    public class Currency : BaseEntity
    {
        public string Name {  get; set; }

        public decimal Value { get; set; }
    }
}
