using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entity.Entities.Lesson
{
    public class LessonCategory : BaseEntity
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Thumbnail { get; set; }
        public LessonCategoryEnum LessonCategoryEnum { get; set; }
        public virtual ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
        public LessonCategory()
        {
            Id = Guid.NewGuid();
            CreatedDate = DateTime.Now;
            IsDeleted = false;
        }
    }

    public class LessonCategoryConfiguration : IEntityTypeConfiguration<LessonCategory>
    {
        public void Configure(EntityTypeBuilder<LessonCategory> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Name).HasColumnType("nvarchar(255)").IsRequired();
            builder.Property(x => x.Thumbnail).HasColumnType("nvarchar(1000)").IsRequired();
        }
    }

    // define enum for LessonCategory
    public enum LessonCategoryEnum
    {
        Vocabulary = 1,
        Grammar = 2,
        Dictionary = 3,
        Course = 4,
    }
}
