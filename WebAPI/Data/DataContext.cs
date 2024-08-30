using Microsoft.EntityFrameworkCore;
using WebAPI.Dtos;
using WebAPI.Models;

namespace WebAPI.Data
{
    public class DataContext : DbContext
    {
        public DataContext( DbContextOptions<DataContext> options ) : base(options)
        {
            
        }


        public DbSet<City> Cities { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Image> Images { get; set; }

        public DbSet<UserImage> UserImages { get; set; }

        public DbSet<Property> Properties { get; set; }

        public DbSet<PropertyType> PropertyTypes { get; set; }

        public DbSet<FurnishingType> FurnishingTypes { get; set; }

        public DbSet<PropertyStatsDto> PropertyStatsView { get; set; }

        public DbSet<Currency> Currencies { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Currency>()
                .Property(c => c.Value)
                .HasColumnType("decimal(18,6)");


            modelBuilder.Entity<UserImage>().HasKey(i => new { i.UserId, i.ImageId});


            modelBuilder.Entity<UserImage>()
                .HasOne(ui => ui.User)
                .WithMany(u => u.Images)
                .HasForeignKey(ui => ui.UserId)
                .OnDelete(DeleteBehavior.Cascade); 

            modelBuilder.Entity<UserImage>()
                        .HasOne(ui => ui.Image)
                        .WithMany(i => i.Users)
                        .HasForeignKey(ui => ui.ImageId)
                        .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PropertyStatsDto>()
                .ToView(nameof(PropertyStatsView))
                .HasKey(t => t.Id);

        }
    }
}
