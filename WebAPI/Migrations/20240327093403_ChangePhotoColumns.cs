using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class ChangePhotoColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "IsPrimary",
                table: "Photos");

            migrationBuilder.RenameColumn(
                name: "PublicId",
                table: "Photos",
                newName: "FileName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FileName",
                table: "Photos",
                newName: "PublicId");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Photos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsPrimary",
                table: "Photos",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
