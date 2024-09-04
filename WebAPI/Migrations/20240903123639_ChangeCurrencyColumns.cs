using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class ChangeCurrencyColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastUpdatedBy",
                table: "Currencies");

            migrationBuilder.RenameColumn(
                name: "LastUpdatedOn",
                table: "Currencies",
                newName: "AddedOn");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AddedOn",
                table: "Currencies",
                newName: "LastUpdatedOn");

            migrationBuilder.AddColumn<int>(
                name: "LastUpdatedBy",
                table: "Currencies",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
