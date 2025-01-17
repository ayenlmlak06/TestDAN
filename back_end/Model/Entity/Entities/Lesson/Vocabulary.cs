using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entity.Entities.Lesson
{
    public class Vocabulary : BaseEntity
    {
        public Guid Id { get; set; }
        public required string Word { get; set; }
        public VocabularyType Type { get; set; }
        public required string Pronunciation { get; set; }
        public required string Meaning { get; set; }
        public string? Example { get; set; }
        public string? Note { get; set; }
        public Guid LessonId { get; set; }
        public required Lesson Lesson { get; set; }
        public ICollection<VocabularyMedia>? VocabularyMedias { get; set; } = new List<VocabularyMedia>();

        public Vocabulary()
        {
            Id = Guid.NewGuid();
            CreatedDate = DateTime.Now;
            IsDeleted = false;
        }
    }

    public class VocabularyConfiguration : IEntityTypeConfiguration<Vocabulary>
    {
        public void Configure(EntityTypeBuilder<Vocabulary> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Word).HasColumnType("varchar(255)").IsRequired();
            builder.Property(x => x.Type).HasColumnType("varchar(255)").IsRequired();
            builder.Property(x => x.Pronunciation).HasColumnType("varchar(255)").IsRequired();
            builder.Property(x => x.Meaning).HasColumnType("varchar(255)").IsRequired();
            builder.Property(x => x.Example).HasColumnType("nvarchar(255)").IsRequired();
            builder.Property(x => x.Note).HasColumnType("nvarchar(255)");
            builder.HasOne(x => x.Lesson).WithMany(x => x.Vocabularies).HasForeignKey(x => x.LessonId);
            builder.HasMany(x => x.VocabularyMedias).WithOne(x => x.Vocabulary).HasForeignKey(x => x.VocabularyId);
        }
    }

    public enum VocabularyType
    {
        Noun,
        Verb,
        Adjective,
        Adverb,
        Pronoun,
        Preposition,
        Conjunction,
        Interjection
    }
}
