using Controllers;
using DomainService.Interfaces.Lesson;
using Microsoft.AspNetCore.Mvc;
using Model.RequestModel.Lesson;

namespace API_LES_APP.Controllers.Version1.Lesson
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class LessonCategoriesController(IHttpContextAccessor httpContextAccessor, ILessonCategoryService _lessonCategoryService)
        : BaseController(httpContextAccessor)
    {

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            var result = await _lessonCategoryService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync(Guid id)
        {
            var result = await _lessonCategoryService.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromForm] LessonCategoryRequest req)
        {
            var result = await _lessonCategoryService.CreateAsync(currentUserId, username, req);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync(Guid id, [FromForm] LessonCategoryUpdateRequest req)
        {
            var result = await _lessonCategoryService.UpdateAsync(currentUserId, username, id, req);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(Guid id)
        {
            var result = await _lessonCategoryService.DeleteAsync(currentUserId, username, id);
            return Ok(result);
        }
    }
}
