using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class RemoveAdditionalKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserImages_Images_ImageId1",
                table: "UserImages");

            migrationBuilder.DropForeignKey(
                name: "FK_UserImages_Users_UserId1",
                table: "UserImages");

            migrationBuilder.DropIndex(
                name: "IX_UserImages_ImageId1",
                table: "UserImages");

            migrationBuilder.DropIndex(
                name: "IX_UserImages_UserId1",
                table: "UserImages");

            migrationBuilder.DropColumn(
                name: "ImageId1",
                table: "UserImages");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "UserImages");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ImageId1",
                table: "UserImages",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId1",
                table: "UserImages",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserImages_ImageId1",
                table: "UserImages",
                column: "ImageId1");

            migrationBuilder.CreateIndex(
                name: "IX_UserImages_UserId1",
                table: "UserImages",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_UserImages_Images_ImageId1",
                table: "UserImages",
                column: "ImageId1",
                principalTable: "Images",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserImages_Users_UserId1",
                table: "UserImages",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
