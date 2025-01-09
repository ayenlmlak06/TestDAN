using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entity.Entities.Lesson
{
    public class LessonCategory : BaseEntity
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Thumbnail { get; set; }

        public virtual ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
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
}
