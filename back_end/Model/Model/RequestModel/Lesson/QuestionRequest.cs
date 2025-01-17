using FluentValidation;

namespace Model.RequestModel.Lesson
{
    public class QuestionRequest
    {
        public string Content { get; set; } = string.Empty;
        public List<AnswerRequest> Answers { get; set; } = [];
    }

    public class AnswerRequest
    {
        public string Content { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
    }

    public class QuestionRequestValidation : AbstractValidator<QuestionRequest>
    {
        public QuestionRequestValidation()
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
