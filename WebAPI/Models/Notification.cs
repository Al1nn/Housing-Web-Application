namespace WebAPI.Models
{
    public class Notification
    {
        public string Title { get; set; }
        public string Body { get; set; }
        public Dictionary<string, string> Data { get; set; }
        public string Timestamp {  get; set; }
    }
}
