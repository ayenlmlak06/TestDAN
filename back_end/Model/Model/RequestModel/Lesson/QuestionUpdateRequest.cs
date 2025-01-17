using FluentValidation;

namespace Model.RequestModel.Lesson
{
    public class QuestionUpdateRequest
    {
        public Guid Id { get; set; } = Guid.Empty;
        public string Content { get; set; } = string.Empty;
        public List<AnswerUpdateRequest> Answers { get; set; } = [];
    }

    public class AnswerUpdateRequest
    {
        public Guid Id { get; set; } = Guid.Empty;
        public string Content { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
    }

    public class QuestionUpdateRequestValidation : AbstractValidator<QuestionUpdateRequest>
    {
        public QuestionUpdateRequestValidation()
        {
            RuleFor(x => x.Content)
                .NotEmpty()
                .WithMessage($"{nameof(QuestionRequest.Content)} is required")
                .MaximumLength(1000)
                .WithMessage($"{nameof(QuestionRequest.Content)} must be less than 1000 characters long");
            RuleFor(x => x.Answers)
                .NotEmpty()
                .WithMessage($"{nameof(QuestionRequest.Answers)} is required")
                .Must(x => x.Count > 1)
                .WithMessage($"{nameof(QuestionRequest.Answers)} must have at least 2 answers")
                .Must(x => x.Any(x => x.IsCorrect))
                .WithMessage($"{nameof(QuestionRequest.Answers)} must have at least 1 correct answer");
        }
    }
}
