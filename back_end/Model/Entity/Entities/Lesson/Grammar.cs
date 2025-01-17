using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entity.Entities.Lesson
{
    public class Grammar : BaseEntity
    {
        public Guid Id { get; set; }
        public required string Content { get; set; }
        public string? Note { get; set; }
        public Guid LessonId { get; set; }
        public virtual required Lesson Lesson { get; set; }

        public Grammar()
        {
            Id = Guid.NewGuid();
            CreatedDate = DateTime.Now;
            IsDeleted = false;
        }
    }

    public class GrammarConfiguration : IEntityTypeConfiguration<Grammar>
    {
        public void Configure(EntityTypeBuilder<Grammar> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Content).HasColumnType("nvarchar(1000)").IsRequired();
            builder.Property(x => x.Note).HasColumnType("nvarchar(1000)");
            builder.HasOne(x => x.Lesson).WithMany(x => x.Grammars).HasForeignKey(x => x.LessonId);
        }
    }
}
