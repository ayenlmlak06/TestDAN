using FluentValidation;

namespace Model.RequestModel.Lesson
{
    public class GrammarUpdateRequest
    {
        public Guid Id { get; set; } = Guid.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Note { get; set; }
    }

    public class GrammarUpdateRequestValidation : AbstractValidator<GrammarUpdateRequest>
    {
        public GrammarUpdateRequestValidation()
        {
            RuleFor(x => x.Content)
                .NotEmpty()
                .WithMessage($"{nameof(GrammarRequest.Content)} is required")
                .MaximumLength(1000)
                .WithMessage($"{nameof(GrammarRequest.Content)} must be less than 1000 characters long");
        }
    }
}
