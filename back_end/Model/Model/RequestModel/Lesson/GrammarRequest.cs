using FluentValidation;

namespace Model.RequestModel.Lesson
{
    public class GrammarRequest
    {
        public string Content { get; set; } = string.Empty;
        public string? Note { get; set; }
    }

    public class GrammarRequestValidation : AbstractValidator<GrammarRequest>
    {
        public GrammarRequestValidation()
        {
            RuleFor(x => x.Content)
                .NotEmpty()
                .WithMessage($"{nameof(GrammarRequest.Content)} is required")
                .MaximumLength(1000)
                .WithMessage($"{nameof(GrammarRequest.Content)} must be less than 1000 characters long");
        }
    }
}
