using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using Model.RequestModel.Lesson;

namespace Model.RequestModel
{
    public static class ValidatorServiceRegistration
    {
        public static IServiceCollection ValidatorsServiceRegistration(this IServiceCollection service)
        {
            service.AddScoped<IValidator<LessonRequest>, LessonRequestValidator>();
            service.AddScoped<IValidator<VocabularyRequest>, VocabularyRequestValidation>();
            service.AddScoped<IValidator<GrammarRequest>, GrammarRequestValidation>();
            service.AddScoped<IValidator<QuestionRequest>, QuestionRequestValidation>();

            service.AddScoped<IValidator<LessonUpdateRequest>, LessonUpdateRequestValidator>();
            service.AddScoped<IValidator<VocabularyUpdateRequest>, VocabularyUpdateRequestValidation>();
            service.AddScoped<IValidator<GrammarUpdateRequest>, GrammarUpdateRequestValidation>();
            service.AddScoped<IValidator<QuestionUpdateRequest>, QuestionUpdateRequestValidation>();
            return service;
        }
    }
}
