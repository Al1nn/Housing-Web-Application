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
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using System.Runtime.InteropServices;
using WebAPI.Extensions;
using Microsoft.IdentityModel.Tokens;
using System.Drawing.Printing;
using System.ComponentModel;


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

        [HttpGet("stats")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPropertyStats()
        {
            var stats = await uow.PropertyRepository.GetPropertyStatsAsync();
            return Ok(stats);
        }



        [HttpGet("list/{sellRent}/{pageNumber}/{pageSize}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPropertyPage(int sellRent, int pageNumber, int pageSize)
        {
            var propertyListDto = await uow.PropertyRepository.GetPropertiesAsync(sellRent);

            var paginatedProperties = await uow.PropertyRepository.GetPropertiesPageAsync(sellRent, pageNumber, pageSize);
            var paginatedPropertiesDto = mapper.Map<IEnumerable<PropertyListDto>>(paginatedProperties);

            var response = new
            {
                totalRecords = propertyListDto.Count(),
                properties = paginatedPropertiesDto
            };

            return Ok(response);
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

        [HttpGet("dashboard/{pageNumber}/{pageSize}")]
        [Authorize]
        public async Task<IActionResult> GetUserPropertyPage(int pageNumber, int pageSize)
        {
            int userId = GetUserId();

            var properties = await uow.PropertyRepository.GetUserPropertiesAsync(userId);
            var propertyListDto = mapper.Map<IEnumerable<PropertyListDto>>(properties);



            var paginatedUserProperty = await uow.PropertyRepository.GetUserPropertiesPageAsync(userId, pageNumber, pageSize);
            var paginatedUserPropertyDto = mapper.Map<IEnumerable<PropertyListDto>>(paginatedUserProperty);


            var response = new { 
                totalRecords = propertyListDto.Count(),
                properties = paginatedUserPropertyDto
            };

            return Ok(response);
        }


        [HttpPost("filter/dashboard")]
        [Authorize]
        public async Task<IActionResult> GetUserPropertiesFiltered([FromBody] FiltersDto filters)
        {
            int userId = GetUserId();
            var userProperties = await uow.PropertyRepository.GetUserPropertiesAsync(userId);
            var userPropertyListDto = mapper.Map<IEnumerable<PropertyListDto>>(userProperties);


            var userFilteredPropertyListDto = FilterProperties(userPropertyListDto, filters.filterWord, filters.minBuiltArea, filters.maxBuiltArea);


            bool isAscending = filters.sortDirection.Equals("asc", StringComparison.OrdinalIgnoreCase);

            userFilteredPropertyListDto = filters.sortByParam?.ToLower() switch
            {
                "city" => isAscending ? userFilteredPropertyListDto.OrderBy(property => property.City) : userFilteredPropertyListDto.OrderByDescending(property => property.City),
                "price" => isAscending ? userFilteredPropertyListDto.OrderBy(property => property.Price) : userFilteredPropertyListDto.OrderByDescending(property => property.Price),
                "price per area" => isAscending ? userFilteredPropertyListDto.OrderBy(property => property.Price / property.BuiltArea) : userFilteredPropertyListDto.OrderByDescending(property => property.Price / property.BuiltArea),
                _ => userFilteredPropertyListDto
            };

            if (filters.sortByParam.IsEmpty())
            {

                userFilteredPropertyListDto = filters.sortDirection?.ToLower() switch
                {
                    "asc" => userFilteredPropertyListDto.OrderBy(property => property.Name),
                    "desc" => userFilteredPropertyListDto.OrderByDescending(property => property.Name),
                    _ => userFilteredPropertyListDto
                };


                if (filters.minBuiltArea > 0 || filters.maxBuiltArea > 0)
                {
                    userFilteredPropertyListDto = filters.sortDirection?.ToLower() switch
                    {
                        "asc" => userFilteredPropertyListDto.OrderBy(property => property.BuiltArea),
                        "desc" => userFilteredPropertyListDto.OrderByDescending(property => property.BuiltArea),
                        _ => userFilteredPropertyListDto
                    };
                }

            }

            var paginatedProperties = PaginateProperties(userFilteredPropertyListDto, filters.pageNumber, filters.pageSize);

            var response = new
            {
                totalRecords = userFilteredPropertyListDto.Count(),
                properties = paginatedProperties
            };


            return Ok(response);
        }


        [HttpPost("filter/{sellRent}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPropertiesFiltered(int sellRent, [FromBody] FiltersDto filters)
        {
            var properties = await uow.PropertyRepository.GetPropertiesAsync(sellRent);
            var propertyListDto = mapper.Map<IEnumerable<PropertyListDto>>(properties);

            var filteredProperties = FilterProperties(propertyListDto, filters.filterWord, filters.minBuiltArea, filters.maxBuiltArea);

            bool isAscending = filters.sortDirection.Equals("asc", StringComparison.OrdinalIgnoreCase);
            filteredProperties = filters.sortByParam?.ToLower() switch
            {
                "city" => isAscending ? filteredProperties.OrderBy(property => property.City) : filteredProperties.OrderByDescending(property => property.City),
                "price" => isAscending ? filteredProperties.OrderBy(property => property.Price) : filteredProperties.OrderByDescending(property => property.Price),
                "price per area" => isAscending ? filteredProperties.OrderBy(property => property.Price / property.BuiltArea) : filteredProperties.OrderByDescending(property => property.Price / property.BuiltArea),
                _ => filteredProperties
            };
            
            
            if (filters.sortByParam.IsEmpty())
            {
                
                filteredProperties = filters.sortDirection?.ToLower() switch
                {
                    "asc" => filteredProperties.OrderBy(property => property.Name),
                    "desc" => filteredProperties.OrderByDescending(property => property.Name),
                    _ => filteredProperties
                };


                if(filters.minBuiltArea > 0 || filters.maxBuiltArea > 0)
                {
                    filteredProperties = filters.sortDirection?.ToLower() switch
                    {
                        "asc" => filteredProperties.OrderBy(property => property.BuiltArea),
                        "desc" => filteredProperties.OrderByDescending(property => property.BuiltArea),
                        _ => filteredProperties
                    };
                }
                
            }
            
            var paginatedProperties = PaginateProperties(filteredProperties, filters.pageNumber, filters.pageSize);

            var response = new
            {
                totalRecords = filteredProperties.Count(),
                properties = paginatedProperties
            };

            return Ok(response);
        }


        private IEnumerable<PropertyListDto> FilterProperties(IEnumerable<PropertyListDto> properties, string filterWord, int minBuiltArea, int maxBuiltArea)
        {
            return properties.Where(property =>
                    (
                        string.IsNullOrEmpty(filterWord)
                        || property.City.Contains(filterWord, StringComparison.OrdinalIgnoreCase)
                    )
                    &&
                    (
                        (minBuiltArea == 0 && maxBuiltArea == 0) ||
                        (minBuiltArea != 0 && maxBuiltArea == 0 && property.BuiltArea >= minBuiltArea) ||
                        (minBuiltArea == 0 && maxBuiltArea != 0 && property.BuiltArea <= maxBuiltArea) ||
                        (minBuiltArea != 0 && maxBuiltArea != 0 && property.BuiltArea >= minBuiltArea && property.BuiltArea <= maxBuiltArea)
                    )
                );
        }

        private IEnumerable<PropertyListDto> PaginateProperties(IEnumerable<PropertyListDto> properties, int pageNumber, int pageSize)
        {
            return properties.Skip((pageNumber - 1) * pageSize).Take(pageSize);
        }





        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPropertyById(int id)
        {
            var property = await uow.PropertyRepository.GetPropertyByIdAsync(id);
            var propertyDto = mapper.Map<PropertyListDto>(property);
            return Ok(propertyDto);
        }


        [HttpGet("count")]
        [Authorize]
        public async Task<IActionResult> GetPropertyCountByUser()
        {
            int userId = GetUserId();
            int propertyCount = await uow.PropertyRepository.GetPropertyCountByUserAsync(userId);

            return Ok(propertyCount);
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
            int userId = GetUserId();

            if (property == null)
            {
                apiError.ErrorCode = NotFound().StatusCode;
                apiError.ErrorMessage = "Property not found for deleting";
                apiError.ErrorDetails = "";
                return NotFound(apiError);
            }

            if(property.PostedBy != userId)
            {
                apiError.ErrorCode = Unauthorized().StatusCode;
                apiError.ErrorMessage = "You must be owner to delete";
                apiError.ErrorDetails = "";
                return Unauthorized(apiError);
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
            
            int userId = GetUserId();
          
           
            var newProperty = mapper.Map<Property>(propertyDto);
            if (newProperty == null)
            {
                apiError.ErrorCode = BadRequest().StatusCode;
                apiError.ErrorMessage = "Property sent from client is null";
                apiError.ErrorDetails = "";
                return BadRequest(apiError);
            }
         
            

            var existingProperty = await uow.PropertyRepository.GetPropertyByIdAsync(propId);
            
            if(existingProperty == null)
            {
                apiError.ErrorCode = NotFound().StatusCode;
                apiError.ErrorMessage = "Property to update is not found";
                apiError.ErrorDetails = "";
                return NotFound(apiError);
            }

            if (!IsAdmin())
            {
                apiError.ErrorCode = Unauthorized().StatusCode;
                apiError.ErrorMessage = "You must be admin to update";
                apiError.ErrorDetails = "";
                return Unauthorized(apiError);
            }

            //if (existingProperty.PostedBy != userId)
            //{
            //    apiError.ErrorCode = Unauthorized().StatusCode;
            //    apiError.ErrorMessage = "You must be owner to update";
            //    apiError.ErrorDetails = "";
            //    return Unauthorized(apiError);
            //}


            

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

        [HttpGet("get/first/photo/{propId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetFirstPropertyPhoto(int propId)
        {
            ApiError apiError = new ApiError();
            var property = await uow.PropertyRepository.GetPropertyByIdAsync(propId);

            if (property == null)
            {
                apiError.ErrorCode = NotFound().StatusCode;
                apiError.ErrorMessage = "Property Not Found";
                apiError.ErrorDetails = "Invalid propId";
                return NotFound(apiError);
            }

            if (!property.Photos.Any()) 
            {
                apiError.ErrorCode = NotFound().StatusCode;
                apiError.ErrorMessage = "Photos Not Found";
                apiError.ErrorDetails = "No photos available for this property";
                return NotFound(apiError);
            }

            var firstPhotoDto = mapper.Map<PhotoDto>(property.Photos.FirstOrDefault());
            return Ok(firstPhotoDto);
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
        [HttpPost("add/photo/{propId}")]
        [Authorize]
        public async Task<IActionResult> AddPropertyPhoto([FromForm] IFormFile file,  [FromForm] string? description, int propId)
        {
            ApiError apiError = new ApiError();



            await Console.Out.WriteLineAsync(description);



            var property = await uow.PropertyRepository.GetPropertyByIdAsync(propId);
            int userId = GetUserId();

            if (property == null)
            {
                apiError.ErrorCode = NotFound().StatusCode;
                apiError.ErrorMessage = "Fresh Added Property Not Found";
                apiError.ErrorDetails = "Possibly invalid ID";
                return NotFound(apiError);
            }

            if(property.PostedBy != userId)
            {
                apiError.ErrorCode = Unauthorized().StatusCode;
                apiError.ErrorMessage = "You are not authorised to add photos";
                apiError.ErrorDetails = "Not the right role";
                return Unauthorized(apiError);
            }

            if (file.Length == 0)
            {
                return NoContent();
            }
           
            string originalSizesDirectory = Path.Combine(Directory.GetCurrentDirectory(),"wwwroot","UPLOADS","originalSizes");
            string thumbnailsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UPLOADS", "thumbnails");

            if (!Directory.Exists(originalSizesDirectory))
            {
                Directory.CreateDirectory(originalSizesDirectory);
            }

            if(!Directory.Exists(thumbnailsDirectory))
            {
                Directory.CreateDirectory(thumbnailsDirectory);
            }

                

            string uniqueId = Guid.NewGuid().ToString();
            var fileName = uniqueId + '-' + file.FileName;
            var originalPath = Path.Combine(originalSizesDirectory, fileName);
            var thumbnailPath = Path.Combine(thumbnailsDirectory, fileName);


            using (var stream = new FileStream(originalPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

             
            using (var image = SixLabors.ImageSharp.Image.Load(originalPath))
            {
                var resizeOptions = new ResizeOptions { 
                   Mode = ResizeMode.Max,
                   Size = new Size(800,800),
                   Position = AnchorPositionMode.Center
                };

                image.Mutate(x => x.Resize(resizeOptions));
                image.Save(thumbnailPath);
            }

            var photo = new Photo
            {
               FileName = fileName,
               PropertyId = propId,
               LastUpdatedOn = DateTime.Now,
               LastUpdatedBy = userId
            };

            property.Photos.Add(photo);

             
            if (await uow.SaveAsync()) return Ok();

            apiError.ErrorCode = BadRequest().StatusCode;
            apiError.ErrorMessage = "Unknown Error Occured";
            apiError.ErrorDetails = "";
            return BadRequest(apiError);
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

            var photo = property.Photos.FirstOrDefault(p => p.FileName == fileName && p.PropertyId == property.Id);
       

            if(photo == null )
            {
                apiError.ErrorCode = BadRequest().StatusCode;
                apiError.ErrorMessage = "No such property or photo exists";
                apiError.ErrorDetails = "You delete a non-existent photo";
                return BadRequest(apiError);
            }

            if (photo.FileName != null )
            {
                var thumbnailsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UPLOADS", "thumbnails", photo.FileName);
                var originalsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UPLOADS", "originalSizes", photo.FileName);
                if(System.IO.File.Exists(thumbnailsPath)) { 
                    System.IO.File.Delete(thumbnailsPath);
                }
                if (System.IO.File.Exists(originalsPath))
                {
                    System.IO.File.Delete(originalsPath);
                }

                property.Photos.Remove(photo);
            }



            if (await uow.SaveAsync()) return Ok();

            apiError.ErrorCode= BadRequest().StatusCode;
            apiError.ErrorMessage = "Unknown Error Occured";
            apiError.ErrorDetails = "I dont know";
            return Ok(apiError);
            
        }

        
    }
}
