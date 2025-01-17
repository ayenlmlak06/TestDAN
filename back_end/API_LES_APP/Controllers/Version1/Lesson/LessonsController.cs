using Common.Authorization;
using Controllers;
using DomainService.Interfaces.Lesson;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Model.RequestModel.Lesson;

namespace API_LES_APP.Controllers.Version1.Lesson
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class LessonsController(
        IHttpContextAccessor httpContextAccessor,
        ILessonService _lessonService,
        IValidator<LessonRequest> _validator) : BaseController(httpContextAccessor)
    {

        [HttpGet]
        public async Task<IActionResult> GetByLessonCategory(Guid? categoryId, int pageIndex = 1, int pageSize = 50, string? keyword = "", bool isOrderByView = false)
        {
            var result = await _lessonService.GetByLessonCategory(categoryId ?? Guid.Empty, pageIndex, pageSize, keyword, isOrderByView);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _lessonService.GetById(id);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(LessonRequest req)
        {
            var validator = await _validator.ValidateAsync(req);
            if (!validator.IsValid)
                throw new AppException(validator.Errors[0].ErrorMessage);

            var result = await _lessonService.Create(currentUserId, username, req);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, LessonUpdateRequest req)
        {
            var result = await _lessonService.Update(currentUserId, username, id, req);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _lessonService.Delete(currentUserId, username, id);
            return Ok(result);
        }
    }
}
