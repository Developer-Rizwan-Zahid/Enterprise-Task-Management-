using Microsoft.EntityFrameworkCore;
using TaskService.Models;

namespace TaskService.Data
{
    public class TaskDbContext : DbContext
    {
        public TaskDbContext(DbContextOptions<TaskDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasIndex(u => u.Username).IsUnique();

            modelBuilder.Entity<TaskItem>()
                .HasOne(t => t.AssignedTo)
                .WithMany(u => u.Tasks)
                .HasForeignKey(t => t.AssignedToUserId);
        }
    }
}
