using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entity.Entities.Lesson
{
    public class Lesson : BaseEntity
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public int TotalQuestion { get; set; }
        public int TotalView { get; set; }
        public Guid LessonCategoryId { get; set; }
        public virtual required LessonCategory LessonCategory { get; set; }
        public ICollection<Vocabulary> Vocabularies { get; set; } = new List<Vocabulary>();
        public ICollection<Grammar> Grammars { get; set; } = new List<Grammar>();
        public ICollection<UserProgress> UserProgresses { get; set; } = new List<UserProgress>();
        public ICollection<Question> Questions { get; set; } = new List<Question>();
    }

    public class LessonConfiguration : IEntityTypeConfiguration<Lesson>
    {
        public void Configure(EntityTypeBuilder<Lesson> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasIndex(x => x.Title);
            builder.Property(x => x.Title).HasColumnType("nvarchar(255)").IsRequired();
            builder.Property(x => x.TotalQuestion).IsRequired();
            builder.Property(x => x.TotalView).IsRequired();
            builder.HasOne(x => x.LessonCategory).WithMany(x => x.Lessons).HasForeignKey(x => x.LessonCategoryId).OnDelete(DeleteBehavior.Cascade);
            builder.HasMany(x => x.Vocabularies).WithOne(x => x.Lesson).HasForeignKey(x => x.LessonId).OnDelete(DeleteBehavior.Cascade);
            builder.HasMany(x => x.Grammars).WithOne(x => x.Lesson).HasForeignKey(x => x.LessonId).OnDelete(DeleteBehavior.Cascade);
            builder.HasMany(x => x.Questions).WithOne(x => x.Lesson).HasForeignKey(x => x.LessonId).OnDelete(DeleteBehavior.Cascade);

        }
    }
}
