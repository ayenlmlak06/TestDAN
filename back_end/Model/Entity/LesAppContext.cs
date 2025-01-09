using Entity.Entities.Account;
using Entity.Entities.Lesson;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace Entity;

public class LesAppContext : DbContext
{
    public LesAppContext()
    {
    }

    public LesAppContext(DbContextOptions<LesAppContext> options)
        : base(options)
    {
    }

    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<Device> Devices { get; set; }
    public virtual DbSet<LessonCategory> LessonCategories { get; set; }
    public virtual DbSet<UserProgress> UserProgresses { get; set; }
    public virtual DbSet<Lesson> Lessons { get; set; }
    public virtual DbSet<Vocabulary> Vocabularies { get; set; }
    public virtual DbSet<Grammar> Grammars { get; set; }
    public virtual DbSet<Question> Questions { get; set; }
    public virtual DbSet<Answer> Answers { get; set; }


    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
       => base.OnConfiguring(optionsBuilder);

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Ignore<BaseEntity>();
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
