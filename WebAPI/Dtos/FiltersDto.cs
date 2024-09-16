namespace WebAPI.Dtos
{
    public class FiltersDto
    {
        public string filterWord { get; set; } = "";

        public int minBuiltArea { get; set; } = 0;

        public int maxBuiltArea { get; set; } = 0;

        public string sortByParam { get; set; } = "";

        public string sortDirection { get; set; } = "";

        public int pageNumber { get; set; } = 1;

        public int pageSize { get; set; } = 4;
    }
}
