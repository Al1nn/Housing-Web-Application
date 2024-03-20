using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using WebAPI.Interfaces;

namespace WebAPI.Services
{
    public class PhotoService : IPhotoService
    {
        private readonly Cloudinary cloudinary;

        public PhotoService(IConfiguration configuration)
        {
            Account account = new Account(
                configuration.GetSection("CloudinarySettings:CloudName").Value,
                configuration.GetSection("CloudinarySettings:ApiKey").Value,
                configuration.GetSection("CloudinarySettings:ApiSecret").Value
                );

            cloudinary = new Cloudinary(account);
        }

        public async Task<DeletionResult> DeletePhotoAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);

            var result = await cloudinary.DestroyAsync(deleteParams);

            return result;
        }

        public async Task<ImageUploadResult> UploadPhotoAsync(IFormFile photo)
        {
            var uploadResult = new ImageUploadResult();
            if(photo.Length > 0 )
            {
                using var stream = photo.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(photo.FileName, stream),
                    Transformation = new Transformation()
                    .Height(500).Width(800)
                };
                uploadResult = await cloudinary.UploadAsync(uploadParams);
            }
            Console.WriteLine(uploadResult.JsonObj.ToString());
            return uploadResult;
        }

        
    }
}
