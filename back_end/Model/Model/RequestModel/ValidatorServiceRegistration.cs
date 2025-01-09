using Microsoft.Extensions.DependencyInjection;

namespace Model.RequestModel
{
    public static class ValidatorServiceRegistration
    {
        public static IServiceCollection ValidatorsServiceRegistration(this IServiceCollection service)
        {
            return service;
        }
    }
}
