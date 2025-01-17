using Microsoft.AspNetCore.Http;

namespace DomainService.Interfaces.File
{
    public interface IFileService
    {
        Task<List<string>> UploadFileToAzureAsync(string folder, List<IFormFile> files);
        Task<bool> DeleteFileFromAzureAsync(string fileName);
        object GetAllFolderUpdate();
    }
}
