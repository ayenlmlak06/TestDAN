using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entity.Entities.Lesson
{
    public class VocabularyMedia : BaseEntity
    {
        public Guid Id { get; set; }
        public required string Url { get; set; }
        public Guid VocabularyId { get; set; }
        public virtual Vocabulary Vocabulary { get; set; }

        public VocabularyMedia()
        {
            Id = Guid.NewGuid();
            CreatedDate = DateTime.Now;
            IsDeleted = false;
        }
    }

    public class VocabularyMediaConfiguration : IEntityTypeConfiguration<VocabularyMedia>
    {
        public void Configure(EntityTypeBuilder<VocabularyMedia> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Url).HasColumnType("nvarchar(1000)").IsRequired();
            builder.HasOne(x => x.Vocabulary).WithMany(x => x.VocabularyMedias).HasForeignKey(x => x.VocabularyId);
        }
    }
}
