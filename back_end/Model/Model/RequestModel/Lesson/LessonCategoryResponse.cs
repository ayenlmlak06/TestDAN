using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace Model.RequestModel.Lesson
{
    public class LessonCategoryRequest
    {
        public string Name { get; set; } = string.Empty;
        public IFormFile? Thumbnail { get; set; }
    }

    public class LessonCategoryUpdateRequest : LessonCategoryRequest { }

    public class LessonCategoryRequestValidator : AbstractValidator<LessonCategoryRequest>
    {
        public LessonCategoryRequestValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required");
            RuleFor(x => x.Thumbnail).NotNull().WithMessage("Thumbnail is required");
        }
    }
}
