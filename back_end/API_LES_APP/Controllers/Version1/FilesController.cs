using Controllers;
using DomainService.Interfaces.File;
using Microsoft.AspNetCore.Mvc;

namespace API_LES_APP.Controllers.Version1
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class FilesController(IHttpContextAccessor httpContextAccessor, IFileService _fileService)
        : BaseController(httpContextAccessor)
    {
        [HttpPost("{folder}")]
        public async Task<IActionResult> UploadMultipleFile(string folder, [FromForm] List<IFormFile> files)
        {
            var result = await _fileService.UploadFileToAzureAsync(folder, files);
            return Ok(result);
        }

        [HttpGet("upload-folders")]
        public IActionResult GetAllFolderUpdate()
        {
            var result = _fileService.GetAllFolderUpdate();
            return Ok(result);
        }
    }
}
