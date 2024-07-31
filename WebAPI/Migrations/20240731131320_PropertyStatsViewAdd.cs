using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class PropertyStatsViewAdd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                CREATE VIEW PropertyStatsView AS
                SELECT 
                c.Id as Id,
                c.Name as City,
                c.Country as Country,
                (SELECT COUNT(*) FROM Properties p WHERE c.Id = p.CityId AND p.SellRent = 1) as SellCount,
                (SELECT COUNT(*) FROM Properties p WHERE c.Id = p.CityId AND p.SellRent = 2) as RentCount
                FROM Cities c;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DROP VIEW PropertyStatsView;");
        }
    }
}
