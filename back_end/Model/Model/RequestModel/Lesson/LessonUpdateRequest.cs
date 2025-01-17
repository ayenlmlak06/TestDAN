using FluentValidation;

namespace Model.RequestModel.Lesson
{
    public class LessonUpdateRequest
    {
        public required string Title { get; set; }
        public string? Thumbnail { get; set; }
        public Guid LessonCategoryId { get; set; }
        public List<VocabularyUpdateRequest> Vocabularies { get; set; } = [];
        public List<GrammarUpdateRequest> Grammars { get; set; } = [];
        public List<QuestionUpdateRequest> Questions { get; set; } = [];
    }

    public class LessonUpdateRequestValidator : AbstractValidator<LessonUpdateRequest>
    {
        public LessonUpdateRequestValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty()
                .WithMessage($"{nameof(LessonRequest.Title)} is required.");

            RuleFor(x => x.LessonCategoryId)
                .NotEmpty()
                .WithMessage($"{nameof(LessonRequest.LessonCategoryId)} is required.");

            RuleForEach(x => x.Vocabularies)
                .SetValidator(new VocabularyUpdateRequestValidation());

            RuleForEach(x => x.Grammars)
                .SetValidator(new GrammarUpdateRequestValidation());

            RuleForEach(x => x.Questions)
                .SetValidator(new QuestionUpdateRequestValidation());
        }
    }
}
