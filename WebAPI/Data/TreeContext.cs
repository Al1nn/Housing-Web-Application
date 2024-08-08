using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

namespace WebAPI.Data
{
    public class TreeContext : DbContext
    {


        public TreeContext(DbContextOptions<TreeContext> options) : base(options) { }

        public DbSet<Tree> Trees { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Tree>()
                .ToTable("Tree")
                .HasKey(t => new { t.RootID, t.NodeID });


            modelBuilder.Entity<TreeResult>().HasNoKey().ToView(null);
        }

        public IQueryable<TreeResult> GetPropertyTreeWithCursor(int rootId)
        {
            return Set<TreeResult>().FromSqlRaw("EXEC GetPropertyTreeWithCursor @p0", rootId);
        }
    }
}
