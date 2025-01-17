using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Specialized;
using Common.Authorization;
using Common.Constant;
using Common.Settings;
using Common.Utils;
using DomainService.Interfaces.File;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.WindowsAzure.Storage;

namespace Infrastructure.Implements.File
{
    public class FileService(IOptions<AzureStorage> azureStorage) : IFileService
    {
        private readonly AzureStorage _azureStorage = azureStorage.Value;
        private readonly List<string> _allowImageExtension = [".jpg", ".jpeg", ".png"];
        private readonly List<string> _allowFileExtension = [".pdf", "txt", ".docx", ".xlsx"];

        public async Task<List<string>> UploadFileToAzureAsync(string folder, List<IFormFile> files)
        {
            try
            {
                var storageAccount = CloudStorageAccount.Parse(_azureStorage.ConnectionString);

                // Create the blob client
                var blobClient = storageAccount.CreateCloudBlobClient();

                // Get a reference to the container
                var container = blobClient.GetContainerReference(_azureStorage.ContainerName);
                var result = new List<string>();

                foreach (var file in files)
                {
                    var extension = Path.GetExtension(file.FileName);
                    if (!_allowImageExtension.Contains(extension) && !_allowFileExtension.Contains(extension))
                    {
                        throw new AppException("File extension is not allowed");
                    }

                    var fileName = Guid.NewGuid() + extension;

                    var blockBlob = container.GetBlockBlobReference(folder + "/" + fileName);
                    await blockBlob.UploadFromStreamAsync(file.OpenReadStream());

                    //add content type
                    blockBlob.Properties.ContentType = _allowImageExtension.Contains(extension) ? "image/jpeg" : "application/pdf";
                    await blockBlob.SetPropertiesAsync();
                    result.Add(blockBlob.Uri.ToString());
                }

                return result;
            }
            catch (Exception e)
            {
                throw new AppException(e.Message);
            }
        }

        public async Task<bool> DeleteFileFromAzureAsync(string fileName)
        {
            try
            {
                var container = GetBlobContainerClient(_azureStorage.ConnectionString ?? "",
                    _azureStorage.ContainerName ?? "");
                var blockBlob = container.GetBlockBlobClient(fileName);
                return await blockBlob.DeleteIfExistsAsync();
            }
            catch (Exception e)
            {
                throw new AppException(e.Message);
            }
        }

        public object GetAllFolderUpdate()
        {
            var result = new List<string>
            {
                UploadFolder.Avatar,
                UploadFolder.Lesson,
                UploadFolder.Question,
                UploadFolder.Grammar,
                UploadFolder.Vocabulary,
                UploadFolder.LessonCategory,
                UploadFolder.Answer,
            };

            return Utils.CreateResponseModel(result);
        }

        #region Private methods

        private BlobContainerClient GetBlobContainerClient(string connectionString, string containerName)
          => new BlobContainerClient(connectionString, containerName);

        #endregion
    }
}
