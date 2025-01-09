using Entity.Entities.Account;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entity.Entities.Lesson
{
    public class UserProgress : BaseEntity
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid LessonId { get; set; }
        public DateTime? CompleteDate { get; set; }
        public virtual required User User { get; set; }
        public virtual required Lesson Lesson { get; set; }
    }

    public class UserProgressConfiguration : IEntityTypeConfiguration<UserProgress>
    {
        public void Configure(EntityTypeBuilder<UserProgress> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(x => x.User).WithMany(x => x.UserProgresses).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(x => x.Lesson).WithMany(x => x.UserProgresses).HasForeignKey(x => x.LessonId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
