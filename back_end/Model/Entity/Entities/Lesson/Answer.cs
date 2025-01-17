using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entity.Entities.Lesson
{
    public class Answer : BaseEntity
    {
        public Guid Id { get; set; }
        public required string Content { get; set; }
        public bool IsCorrect { get; set; }
        public Guid QuestionId { get; set; }
        public virtual Question Question { get; set; }

        public Answer()
        {
            Id = Guid.NewGuid();
            CreatedDate = DateTime.Now;
            IsDeleted = false;
        }
    }

    public class AnswersConfiguration : IEntityTypeConfiguration<Answer>
    {
        public void Configure(EntityTypeBuilder<Answer> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Content).HasColumnType("nvarchar(1000)").IsRequired();
            builder.Property(x => x.IsCorrect).IsRequired();
            builder.HasOne(x => x.Question).WithMany(x => x.Answers).HasForeignKey(x => x.QuestionId);
        }
    }
}
