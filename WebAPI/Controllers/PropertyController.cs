using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.Net;
using System.Reflection.Metadata.Ecma335;
using WebAPI.Dtos;
using WebAPI.Errors;
using WebAPI.Interfaces;
using WebAPI.Models;
using System.Text.RegularExpressions;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyController : BaseController
    {
        private readonly IUnitOfWork uow;
        private readonly IMapper mapper;

        public PropertyController(IUnitOfWork uow, IMapper mapper)
        {
            this.uow = uow;
            this.mapper = mapper;
        }
        //property/list/1
        [HttpGet("list/{sellRent}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPropertyList(int sellRent)
        {
            var properties = await uow.PropertyRepository.GetPropertiesAsync(sellRent);
            var propertyListDto = mapper.Map<IEnumerable<PropertyListDto>>(properties);
            return Ok(propertyListDto);
        }

        [HttpGet("count")]
        [Authorize]
        public async Task<IActionResult> GetPropertyCountByUser()
        {
            int userId = GetUserId();
            int propertyCount = await uow.PropertyRepository.GetPropertyCountByUserAsync(userId);

            return Ok(propertyCount);
        }


        [HttpGet("dashboard")]
        [Authorize]
        public async Task<IActionResult> GetUserProperties()
        {
            int userId = GetUserId();

            var properties = await uow.PropertyRepository.GetUserPropertiesAsync(userId);
            var propertyListDto = mapper.Map<IEnumerable<PropertyListDto>>(properties);
            return Ok(propertyListDto);
        }

        [HttpGet("filter/dashboard/{filterWord}")]
        [Authorize]
        public async Task<IActionResult> GetUserPropertiesFiltered(string filterWord)
        {
            int userId = GetUserId();
            var properties = await uow.PropertyRepository.GetUserPropertiesAsync(userId);
            var propertyListDto = mapper.Map<IEnumerable<PropertyListDto>>(properties);


            var filteredPropertyList = from property in propertyListDto
                                       where property.Name.ToLower().Contains(filterWord.ToLower())
                                            || property.PropertyType.ToLower().Contains(filterWord.ToLower())
                                            || property.City.ToLower().Contains(filterWord.ToLower())

                                       select property;
            return Ok(filteredPropertyList);
        }

        [HttpGet("filter/{sellRent}/{filterWord}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPropertiesFiltered(int sellRent, string filterWord)
        {
            var properties = await uow.PropertyRepository.GetPropertiesAsync(sellRent);
            var propertyListDto = mapper.Map<IEnumerable<PropertyListDto>>(properties);

            var filteredPropertyList = from property in propertyListDto
                                       where property.Name.ToLower().Contains(filterWord.ToLower()) 
                                            || property.PropertyType.ToLower().Contains(filterWord.ToLower())
                                            || property.City.ToLower().Contains(filterWord.ToLower())

                                       select property; 
                                       

            return Ok(filteredPropertyList);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPropertyById(int id)
        {
            var property = await uow.PropertyRepository.GetPropertyByIdAsync(id);
            var propertyDto = mapper.Map<PropertyDto>(property);
            return Ok(propertyDto);
        }

        //property/add
        [HttpGet("detail/{id}")]
        [AllowAnonymous]

        public async Task<IActionResult> GetPropertyDetail(int id)
        {
            var property = await uow.PropertyRepository.GetPropertyDetailAsync(id);
            var propertyDto = mapper.Map<PropertyDetailDto>(property);
            return Ok(propertyDto);
        }

        [HttpDelete("delete/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteProperty(int id)
        {
            var property = await uow.PropertyRepository.GetPropertyByIdAsync(id);
            ApiError apiError = new ApiError();

            if (property == null)
            {
                apiError.ErrorCode = NotFound().StatusCode;
                apiError.ErrorMessage = "Property not found for deleting";
                apiError.ErrorDetails = "";
                return NotFound(apiError);
            }

            uow.PropertyRepository.DeleteProperty(id);
            await uow.SaveAsync();

            return StatusCode(200);
        }

        [HttpPost("add")]
        [Authorize]
        public async Task<IActionResult> AddProperty(PropertyDto propertyDto)
        {
            var property = mapper.Map<Property>(propertyDto);
            var userId = GetUserId();
           

            // Set other properties
            property.PostedBy = userId;
            property.LastUpdatedBy = userId;
            // Add property to repository
            uow.PropertyRepository.AddProperty(property);

            // Save changes to insert property
            await uow.SaveAsync();

            // Return success response
            return StatusCode(201);
        }

        [HttpPut("update/{propId}")]
        [Authorize]
        public async Task<IActionResult> UpdateProperty(int propId,PropertyDto propertyDto)
        {
            ApiError apiError = new ApiError();
            var userRole = GetUserRole();
            var userId = GetUserId();
            if (userRole != UserRole.UserEditor)
            {
                apiError.ErrorCode = Unauthorized().StatusCode;
                apiError.ErrorMessage = "You must be admin to update";
                apiError.ErrorDetails = "";
                return Unauthorized(apiError);
            }
            var newProperty = mapper.Map<Property>(propertyDto);
            if (newProperty == null)
            {
                apiError.ErrorCode = BadRequest().StatusCode;
                apiError.ErrorMessage = "Property sent from client is null";
                apiError.ErrorDetails = "";
                return BadRequest(apiError);
            }
            newProperty.PostedBy = userId;
            newProperty.LastUpdatedBy = userId;


            var existingProperty = await uow.PropertyRepository.GetPropertyByIdAsync(propId);
            
            if(existingProperty == null)
            {
                apiError.ErrorCode = NotFound().StatusCode;
                apiError.ErrorMessage = "Property to update is not found";
                apiError.ErrorDetails = "";
                return NotFound(apiError);
            }

            existingProperty.SellRent = newProperty.SellRent;
            existingProperty.Name = newProperty.Name;
            existingProperty.PropertyTypeId = newProperty.PropertyTypeId;
            existingProperty.PropertyType = newProperty.PropertyType;
            existingProperty.FurnishingTypeId = newProperty.FurnishingTypeId;
            existingProperty.FurnishingType = newProperty.FurnishingType;
            existingProperty.Price = newProperty.Price;
            existingProperty.BHK = newProperty.BHK;
            existingProperty.BuiltArea = newProperty.BuiltArea;
            existingProperty.CityId = newProperty.CityId;
            existingProperty.City = newProperty.City;
            existingProperty.ReadyToMove = newProperty.ReadyToMove;
            existingProperty.CarpetArea = newProperty.CarpetArea;
            existingProperty.FloorNo = newProperty.FloorNo;
            existingProperty.TotalFloors = newProperty.TotalFloors;
            existingProperty.MainEntrance = newProperty.MainEntrance;
            existingProperty.Security = newProperty.Security;
            existingProperty.Gated = newProperty.Gated;
            existingProperty.Maintenance = newProperty.Maintenance;
            existingProperty.EstPossessionOn = newProperty.EstPossessionOn;
   
            existingProperty.Description = newProperty.Description;
            existingProperty.LandMark = newProperty.LandMark;
            existingProperty.Address = newProperty.Address;
            existingProperty.PhoneNumber = newProperty.PhoneNumber;
            existingProperty.LastUpdatedOn = DateTime.Now;
            existingProperty.LastUpdatedBy = userId;
            uow.PropertyRepository.UpdateProperty(existingProperty);

            await uow.SaveAsync();
            return StatusCode(200);
        }


        [HttpGet("get/photos/{propId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPropertyPhotos(int propId)
        {
            ApiError apiError = new ApiError();
            var property = await uow.PropertyRepository.GetPropertyByIdAsync(propId);

            if(property == null)
            {
                apiError.ErrorCode = NotFound().StatusCode;
                apiError.ErrorMessage = "Property Not Found";
                apiError.ErrorDetails = "Invalid propId";
                return NotFound(apiError);
            }

            var photosDto = mapper.Map<IEnumerable<PhotoDto>>(property.Photos.Where(p => p.PropertyId == propId));


            return Ok(photosDto);
        }


        //property/add/photo/1
        [HttpPost("add/photos/{propId}")]
        [Authorize]
        public async Task<IActionResult> AddPropertyPhoto([FromForm] List<IFormFile> originalFiles, [FromForm] List<IFormFile> thumbnailFiles, int propId)
        {
            ApiError apiError = new ApiError();


            var property = await uow.PropertyRepository.GetPropertyByIdAsync(propId);
            int userId = GetUserId();

            if (property == null)
            {
                apiError.ErrorCode = NotFound().StatusCode;
                apiError.ErrorMessage = "Fresh Added Property Not Found";
                apiError.ErrorDetails = "Possibly invalid ID";
                return NotFound(apiError);
            }

            if (originalFiles.Count == 0)
            {
                return NoContent();
            }

            foreach (IFormFile file in originalFiles)
            {
                string uniqueId = Guid.NewGuid().ToString();
                var fileName = uniqueId + '-' + file.FileName;
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot","UPLOADS" , "originalSizes", fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var original = new Photo { 
                    FileName = fileName,
                    PropertyId = propId,
                    LastUpdatedOn = DateTime.Now,
                    LastUpdatedBy = userId
                };

                property.Photos.Add(original);

                Console.WriteLine($"Original file saved : {file.FileName} in {filePath}");
            }
            //Continuare
            foreach (IFormFile file in thumbnailFiles)
            {
                string uniqueId = Guid.NewGuid().ToString();
                var fileName = uniqueId + '-'+ file.FileName;
                var filePath = Path.Combine(Directory.GetCurrentDirectory(),"wwwroot", "UPLOADS", "thumbnails", fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var thumbnail = new Photo
                {
                    FileName = fileName,
                    PropertyId = propId,
                    LastUpdatedOn = DateTime.Now,
                    LastUpdatedBy = userId
                };

                property.Photos.Add(thumbnail);
                Console.WriteLine($"Thumbnail file saved : {file.FileName} in {filePath}");
            }

            if (await uow.SaveAsync()) return Ok();

            apiError.ErrorCode = BadRequest().StatusCode;
            apiError.ErrorMessage = "Unknown Error Occured";
            apiError.ErrorDetails = "";
            return BadRequest(apiError);
        }



        //property/set-primary-photo/1/safasfsagsd
        [HttpPost("set-primary-photo/{propId}/{fileName}")]
        [Authorize]
        public async Task<IActionResult> SetPrimaryPhoto(int propId, string fileName)
        {


            return Ok();
        }


        [HttpDelete("delete/photo/{propId}/{fileName}")]
        [Authorize]
        public async Task<IActionResult> DeletePhoto(int propId, string fileName)
        {
            ApiError apiError = new ApiError();
            int userId = GetUserId();
            
            var property = await  uow.PropertyRepository.GetPropertyByIdAsync(propId);

            if(property == null)
            {
                apiError.ErrorCode = BadRequest().StatusCode;
                apiError.ErrorMessage = "No such property or photo exists";
                apiError.ErrorDetails = "You delete a non-existent property";
                return BadRequest(apiError);
            }

            if(property.PostedBy != userId)
            {
                apiError.ErrorCode = Unauthorized().StatusCode;
                apiError.ErrorMessage = "You are not authorised to delete the photo";
                apiError.ErrorDetails = "You must log in to owner account";
                return Unauthorized(apiError);
            }

            var thumbnail = property.Photos.FirstOrDefault(p => p.FileName == fileName && p.PropertyId == property.Id);
        

            string originalFileName = getOriginalName(fileName);
          
            var original = property.Photos.FirstOrDefault(p => p.FileName.Contains(originalFileName) && !p.FileName.Contains("_thumbnail") && p.PropertyId == property.Id);
           

            if(thumbnail == null )
            {
                apiError.ErrorCode = BadRequest().StatusCode;
                apiError.ErrorMessage = "No such property or photo exists";
                apiError.ErrorDetails = "You delete a non-existent photo";
                return BadRequest(apiError);
            }

            if(thumbnail.FileName != null && original.FileName != null)
            {
                var thumbnailsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UPLOADS", "thumbnails", thumbnail.FileName);
                var originalsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UPLOADS", "originalSizes", original.FileName);
                if(System.IO.File.Exists(thumbnailsPath)) { 
                    System.IO.File.Delete(thumbnailsPath);
                }
                if (System.IO.File.Exists(originalsPath))
                {
                    System.IO.File.Delete(originalsPath);
                }

                property.Photos.Remove(thumbnail);
                property.Photos.Remove(original);
            }



            if (await uow.SaveAsync()) return Ok();

            apiError.ErrorCode= BadRequest().StatusCode;
            apiError.ErrorMessage = "Unknown Error Occured";
            apiError.ErrorDetails = "I dont know";
            return Ok(apiError);
            
        }

        private string getOriginalName(string fileName)
        {
            string pattern = @"(?:[a-f0-9]+(?:-[a-f0-9]+)*)-(.*?)_thumbnail\.jpg$"; // SEARCH ONLY FOR fileName, fileName can have '-' OR '_'  8f04909d-094e-4848-bccf-edb0f0bb5b3a-fileName_thumbnail.jpg


            Match match = Regex.Match(fileName, pattern);

           
            if (match.Success)
            {
                string capturedSubstring = match.Groups[1].Value;

                

                return capturedSubstring;
            }
            else
            {
                
                return string.Empty;
            }
        }
    }
}
