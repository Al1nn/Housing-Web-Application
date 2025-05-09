using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Dtos;
using WebAPI.Errors;
using WebAPI.Interfaces;
using WebAPI.Models;
using System.IO;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using WebAPI.Extensions;

using System.Globalization;



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

        [HttpGet("owner/{id}")]
        [Authorize]
        public async Task<IActionResult> GetPropertyOwner(int id)
        {   
            ApiError apiError = new ApiError();
            
            int userId = GetUserId();

            if (id == userId)
            {
                
                apiError.ErrorCode = BadRequest().StatusCode;
                apiError.ErrorMessage = "Same logged user and owner";
                apiError.ErrorDetails = "";
                return BadRequest(apiError);
            }

            var propertyOwner = await uow.UserRepository.GetUserById(id);

            if(propertyOwner == null)
            {
                apiError.ErrorCode = NotFound().StatusCode;
                apiError.ErrorMessage = "User not found";
                apiError.ErrorDetails = "";
                return NotFound(apiError);
            }

            var propertyOwnerDto = mapper.Map<UserDto>(propertyOwner);

            return Ok(propertyOwnerDto);
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

        //property/detail
        [HttpGet("detail/{id}")]
        [AllowAnonymous]

        public async Task<IActionResult> GetPropertyDetail(int id)
        {
            var property = await uow.PropertyRepository.GetPropertyDetailAsync(id);
            
            var propertyDto = mapper.Map<PropertyDetailDto>(property);
            propertyDto.Likes = property.PropertyLikes.Count; 
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

            if(!IsAdmin())
            {
                apiError.ErrorCode = Unauthorized().StatusCode;
                apiError.ErrorMessage = "You must be admin to delete";
                apiError.ErrorDetails = "";
                return Unauthorized(apiError);
            }

            if(property.Photos != null)
            {
                string originalSizesDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UPLOADS", "originalSizes");
                string thumbnailsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UPLOADS", "thumbnails");

                if (!Directory.Exists(originalSizesDirectory))
                {
                    Directory.CreateDirectory(originalSizesDirectory);
                }

                if (!Directory.Exists(thumbnailsDirectory))
                {
                    Directory.CreateDirectory(thumbnailsDirectory);
                }


                foreach (var photo in property.Photos)
                {
                    string originalPhotoDirectory = Path.Combine(originalSizesDirectory, photo.FileName);
                    string thumbnailsPhotoDirectory = Path.Combine(thumbnailsDirectory, photo.FileName);

                    System.IO.File.Delete(originalPhotoDirectory);
                    System.IO.File.Delete(thumbnailsPhotoDirectory);

                    //if(System.IO.File.Exists(originalPhotoDirectory) && System.IO.File.Exists(thumbnailsPhotoDirectory))
                    //{
                        
                    //}
                    //else
                    //{
                    //    apiError.ErrorCode = NotFound().StatusCode;
                    //    apiError.ErrorMessage = $"The directory of photo : {photo.FileName}, was not found";
                    //    apiError.ErrorDetails = "Path doesnt exist";
                    //    return NotFound(apiError);
                    //}
                    

               
                    
                   
                }

            }

            uow.PropertyRepository.DeleteProperty(id);
            await uow.SaveAsync();

            return StatusCode(200);
        }

        

        [HttpPut("update/{propId}")]
        [Authorize]
        public async Task<IActionResult> UpdateProperty(int propId,PropertyDetailDto propertyDetailDto)
        {
            ApiError apiError = new ApiError();
            
            int userId = GetUserId();

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

            existingProperty.SellRent = propertyDetailDto.SellRent;
            existingProperty.Name = propertyDetailDto.Name;
            existingProperty.PropertyTypeId = propertyDetailDto.PropertyTypeId;
            existingProperty.FurnishingTypeId = propertyDetailDto.FurnishingTypeId;
            existingProperty.Price = propertyDetailDto.Price;
            existingProperty.BHK = propertyDetailDto.BHK;
            existingProperty.BuiltArea = propertyDetailDto.BuiltArea;
            existingProperty.CityId = propertyDetailDto.CityId;
            existingProperty.ReadyToMove = propertyDetailDto.ReadyToMove;
            existingProperty.CarpetArea = propertyDetailDto.CarpetArea;
            existingProperty.FloorNo = propertyDetailDto.FloorNo;
            existingProperty.TotalFloors = propertyDetailDto.TotalFloors;
            existingProperty.MainEntrance = propertyDetailDto.MainEntrance;
            existingProperty.Security = propertyDetailDto.Security;
            existingProperty.Gated = propertyDetailDto.Gated;
            existingProperty.Maintenance = propertyDetailDto.Maintenance;
            existingProperty.EstPossessionOn = propertyDetailDto.EstPossessionOn;

            existingProperty.Description = propertyDetailDto.Description;
            existingProperty.Address = propertyDetailDto.Address;
            existingProperty.Latitude = propertyDetailDto.Latitude;
            existingProperty.Longitude = propertyDetailDto.Longitude;
            existingProperty.PhoneNumber = propertyDetailDto.PhoneNumber;
           
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

        [HttpPost("add")]
        [Authorize]
        public async Task<IActionResult> AddProperty([FromForm] PropertyDto propertyDto, [FromForm] IFormFile[] files)
        {

           
            var property = mapper.Map<Property>(propertyDto);
            
            var userId = GetUserId();


            if(files.Length > 0)
            {
                //Pe aici se intra cu poze
                property.Photos = new List<Photo>();
                
                string originalSizesDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UPLOADS", "originalSizes");
                string thumbnailsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UPLOADS", "thumbnails");

                if (!Directory.Exists(originalSizesDirectory))
                {
                    Directory.CreateDirectory(originalSizesDirectory);
                }

                if (!Directory.Exists(thumbnailsDirectory))
                {
                    Directory.CreateDirectory(thumbnailsDirectory);
                }

                foreach (var file in files)
                {
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
                        var resizeOptions = new ResizeOptions
                        {
                            Mode = ResizeMode.Max,
                            Size = new Size(800, 800),
                            Position = AnchorPositionMode.Center
                        };

                        image.Mutate(x => x.Resize(resizeOptions));
                        image.Save(thumbnailPath);
                    }

                    var photo = new Photo
                    {
                        FileName = fileName,
                        PropertyId = property.Id,
                        LastUpdatedOn = DateTime.Now,
                        LastUpdatedBy = userId
                    };

                    property.Photos.Add(photo);
                }

            }

            

            
            property.PostedBy = userId;
            property.LastUpdatedBy = userId;

            
            
            uow.PropertyRepository.AddProperty(property);


            await uow.SaveAsync();

            return Created();

        }

        //property/add/photo/1
        [HttpPost("add/photo/{propId}")]
        [Authorize]
        public async Task<IActionResult> AddPropertyPhoto( IFormFile file,  [FromForm] string? description, int propId)
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

            if (property.PostedBy != userId && !IsAdmin())
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

            string originalSizesDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UPLOADS", "originalSizes");
            string thumbnailsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UPLOADS", "thumbnails");

            if (!Directory.Exists(originalSizesDirectory))
            {
                Directory.CreateDirectory(originalSizesDirectory);
            }

            if (!Directory.Exists(thumbnailsDirectory))
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
                var resizeOptions = new ResizeOptions
                {
                    Mode = ResizeMode.Max,
                    Size = new Size(800, 800),
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

            if (property.PostedBy != userId && !IsAdmin())
            {
                apiError.ErrorCode = Unauthorized().StatusCode;
                apiError.ErrorMessage = "You are not authorised to delete photos";
                apiError.ErrorDetails = "Not the right role";
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

        [HttpGet("like/{propId}")]
        [Authorize]
        public async Task<IActionResult> LikeProperty(int propId)
        {
            ApiError apiError = new ApiError();
            int userId = GetUserId();
            var property = await uow.PropertyRepository.GetPropertyDetailAsync(propId);

            if(property == null)
            {
                apiError.ErrorCode = BadRequest().StatusCode;
                apiError.ErrorMessage = "No such property or photo exists";
                apiError.ErrorDetails = "You delete a non-existent property";
                return BadRequest(apiError);
            }


            PropertyLike like = new PropertyLike();
            like.PropertyId = propId;
            like.LastUpdatedBy = userId;
            like.LikedBy = userId;
            like.LastUpdatedOn = DateTime.Now;
            
            property.PropertyLikes.Add(like);


            await uow.SaveAsync();

            return Ok();
        }

        [HttpGet("unlike/{propId}")]
        [Authorize]
        public async Task<IActionResult> UnlikeProperty(int propId)
        {

            ApiError apiError = new ApiError();
            int userId = GetUserId();

            var property = await uow.PropertyRepository.GetPropertyDetailAsync(propId);

            if (property == null)
            {
                apiError.ErrorCode = BadRequest().StatusCode;
                apiError.ErrorMessage = "No such property or photo exists";
                apiError.ErrorDetails = "You delete a non-existent property";
                return BadRequest(apiError);
            }

            // I need to remove from Property Likes where LikedBy = userId . I have like property.PropertyLikes.Remove() 
            var like = property.PropertyLikes.FirstOrDefault(l => l.LikedBy == userId);

            if (like == null) {
                apiError.ErrorCode = BadRequest().StatusCode;
                apiError.ErrorMessage = "No such like from property exists";
                apiError.ErrorDetails = "You delete a non-existent like";
                return BadRequest(apiError);
            }

            property.PropertyLikes.Remove(like); 

            if (await uow.SaveAsync() ) return Ok();


            apiError.ErrorCode = BadRequest().StatusCode;
            apiError.ErrorMessage = "Unknown Error Occured";
            apiError.ErrorDetails = "I dont know";
            return Ok(apiError);
        }

        [HttpGet("isLiked/{propId}")]
        [Authorize]
        public async Task<IActionResult> PropertyLiked(int propId)
        {
            ApiError apiError = new ApiError();
            int userId = GetUserId();

            var property = await uow.PropertyRepository.GetPropertyDetailAsync(propId);

            if (property == null)
            {
                apiError.ErrorCode = BadRequest().StatusCode;
                apiError.ErrorMessage = "No such property or photo exists";
                apiError.ErrorDetails = "You delete a non-existent property";
                return BadRequest(apiError);
            }

            // I need to remove from Property Likes where LikedBy = userId . I have like property.PropertyLikes.Remove() 
            var like = property.PropertyLikes.FirstOrDefault(l => l.LikedBy == userId);

            if (like == null)
            {
                return Ok(false);
            }


            return Ok(true);
        }


    }
}
