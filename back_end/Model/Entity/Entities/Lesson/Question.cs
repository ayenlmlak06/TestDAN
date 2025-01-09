using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entity.Entities.Lesson
{
    public class Question : BaseEntity
    {
        public Guid Id { get; set; }
        public required string Content { get; set; }
        public Guid LessonId { get; set; }
        public virtual required Lesson Lesson { get; set; }
        public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();
    }

    public class QuestionConfiguration : IEntityTypeConfiguration<Question>
    {
        public void Configure(EntityTypeBuilder<Question> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Content).HasColumnType("nvarchar(1000)").IsRequired();
            builder.HasOne(x => x.Lesson).WithMany(x => x.Questions).HasForeignKey(x => x.LessonId).OnDelete(DeleteBehavior.Cascade);
            builder.HasMany(x => x.Answers).WithOne(x => x.Question).HasForeignKey(x => x.QuestionId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
