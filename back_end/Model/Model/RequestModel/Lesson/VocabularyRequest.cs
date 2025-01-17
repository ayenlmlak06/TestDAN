using FluentValidation;

namespace Model.RequestModel.Lesson
{
    public class VocabularyRequest
    {
        public string Word { get; set; } = string.Empty;
        public string Pronunciation { get; set; } = string.Empty;
        public string Meaning { get; set; } = string.Empty;
        public string Example { get; set; } = string.Empty;
        public List<string>? Medias { get; set; }
    }


    public class VocabularyRequestValidation : AbstractValidator<VocabularyRequest>
    {
        public VocabularyRequestValidation()
        {
            RuleFor(x => x.Word)
                .NotEmpty()
                .WithMessage($"{nameof(VocabularyRequest.Word)} is required")
                .MaximumLength(255)
                .WithMessage($"{nameof(VocabularyRequest.Word)} must be less than 255 characters long");
            RuleFor(x => x.Pronunciation)
                .NotEmpty()
                .WithMessage($"{nameof(VocabularyRequest.Pronunciation)} is required")
                .MaximumLength(255)
                .WithMessage($"{nameof(VocabularyRequest.Pronunciation)} must be less than 255 characters long");
            RuleFor(x => x.Meaning).NotEmpty().WithMessage($"{nameof(VocabularyRequest.Meaning)} is required");
            RuleFor(x => x.Example).NotEmpty().WithMessage($"{nameof(VocabularyRequest.Example)} is required");

        }
    }
}
