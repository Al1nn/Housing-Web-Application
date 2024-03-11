using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Reflection.Metadata.Ecma335;
using WebAPI.Dtos;
using WebAPI.Errors;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyController : BaseController
    {
        private readonly IUnitOfWork uow;
        private readonly IMapper mapper;
        private readonly IPhotoService photoService;

        public PropertyController(IUnitOfWork uow, IMapper mapper, IPhotoService photoService)
        {
            this.uow = uow;
            this.mapper = mapper;
            this.photoService = photoService;
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

        [HttpPost("add")]
        [Authorize]
        public async Task<IActionResult> AddProperty(PropertyDto propertyDto)
        {
            var property = mapper.Map<Property>(propertyDto);
            var userId = GetUserId();
           

            // Set other properties
            property.PostedBy = userId;
            property.LastUpdatedBy = userId;
            property.Contact.LastUpdatedBy = userId;
            // Add property to repository
            uow.PropertyRepository.AddProperty(property);

            // Save changes to insert property
            await uow.SaveAsync();

            // Return success response
            return StatusCode(201);
        }

        //property/add/photo/1
        [HttpPost("add/photo/{propId}")]
        [Authorize]
        public async Task<ActionResult<PhotoDto>> AddPropertyPhoto(IFormFile file, int propId)
        {

            ApiError apiError = new ApiError();
            var result = await photoService.UploadPhotoAsync(file);
            if(result.Error != null)
            {
                apiError.ErrorCode = 400;
                apiError.ErrorMessage = result.Error.Message;
                apiError.ErrorDetails = "";
                return BadRequest(apiError);
            }

            var property = await uow.PropertyRepository.GetPropertyByIdAsync(propId); 
            //PROPERTY IS NULL ON ADD PROPERTY FORM , BUT NOT FROM THE UPLOAD FILE BECAUSE PROPERTY ALREADY EXISTS
            //TELL ME A FIX

            if (property == null)
            {
                apiError.ErrorCode = NotFound().StatusCode;
                apiError.ErrorMessage = "Property not found with the provided ID";
                apiError.ErrorDetails = "";
                return NotFound(apiError);
            }

            var photo = new Photo
            {
                ImageUrl = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if(property.Photos.Count == 0)
            {
                photo.IsPrimary = true;
            }
            
            property.Photos.Add(photo);


            if(await uow.SaveAsync()) return mapper.Map<PhotoDto>(photo);

            apiError.ErrorCode = BadRequest().StatusCode;
            apiError.ErrorMessage = "Some error occured in uploading the photo please retry";
            apiError.ErrorDetails = "Unknown error"; 
            return BadRequest(apiError);
        }

     

        //property/set-primary-photo/1/safasfsagsd
        [HttpPost("set-primary-photo/{propId}/{photoPublicId}")]
        [Authorize]
        public async Task<IActionResult> SetPrimaryPhoto(int propId, string photoPublicId)
        {
            ApiError apiError = new ApiError();

            var userId = GetUserId();
            var property = await uow.PropertyRepository.GetPropertyByIdAsync(propId);

            if (property == null) {
                apiError.ErrorCode = BadRequest().StatusCode;
                apiError.ErrorMessage = "No such property or photo exists";
                apiError.ErrorDetails = "When you set a property photo that doesnt exist";
                return BadRequest(apiError); 
            }

            if (property.PostedBy != userId) {
                apiError.ErrorCode = Unauthorized().StatusCode;
                apiError.ErrorMessage = "You are not authorised to change the photo";
                apiError.ErrorDetails = "You must log in to your account";
                return BadRequest(apiError); 
            }

            var photo = property.Photos.FirstOrDefault(p => p.PublicId == photoPublicId);

            if (photo == null) {
                apiError.ErrorCode = BadRequest().StatusCode;
                apiError.ErrorMessage = "No such property or photo exists";
                apiError.ErrorDetails = "This error persist when you set no photo of property";
                return BadRequest(apiError); 
            }

            if (photo.IsPrimary) {
                apiError.ErrorCode = BadRequest().StatusCode;
                apiError.ErrorMessage = "This is already a primary photo";
                apiError.ErrorDetails = "This error is when you click on already set primary photo";
                return BadRequest(apiError); 
            }

            var currentPrimary = property.Photos.FirstOrDefault(p => p.IsPrimary);
            if (currentPrimary != null) currentPrimary.IsPrimary = false;

            photo.IsPrimary = true;

            if (await uow.SaveAsync()) return NoContent();

            apiError.ErrorCode = BadRequest().StatusCode;
            apiError.ErrorMessage = "Some error has occured, failed to set primary photo";
            apiError.ErrorDetails = "This error occurs when no primary photo is set";
            return BadRequest(apiError);
        }


        [HttpDelete("delete-photo/{propId}/{photoPublicId}")]
        [Authorize]
        public async Task<IActionResult> DeletePhoto(int propId, string photoPublicId)
        {
            ApiError apiError = new ApiError();
            var userId = GetUserId();

            var property = await uow.PropertyRepository.GetPropertyByIdAsync(propId);

            if (property.PostedBy != userId)
            {
                apiError.ErrorCode = Unauthorized().StatusCode;
                apiError.ErrorMessage = "You are not authorised to delete the photo";
                apiError.ErrorDetails = "You must log in to your account";
                return BadRequest(apiError);
            }
                

            if (property == null || property.PostedBy != userId)
            {
                apiError.ErrorCode = BadRequest().StatusCode;
                apiError.ErrorMessage = "No such property or photo exists";
                apiError.ErrorDetails = "You delete a non-existent photo or property";
                return BadRequest(apiError);
            }
                

            var photo = property.Photos.FirstOrDefault(p => p.PublicId == photoPublicId);

            if (photo == null)
            {
                apiError.ErrorCode = BadRequest().StatusCode;
                apiError.ErrorMessage = "No such property or photo exists";
                apiError.ErrorDetails = "You delete a non-existent photo or property";
                return BadRequest(apiError);
            }
                

            if (photo.IsPrimary)
            {
                apiError.ErrorCode = BadRequest().StatusCode;
                apiError.ErrorMessage = "You can not delete a primary photo";
                apiError.ErrorDetails = "You tried to delete a primary photo";
                return BadRequest(apiError);
            }
                

            if (photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) {
                    apiError.ErrorCode = BadRequest().StatusCode;
                    apiError.ErrorMessage = result.Error.Message;
                    apiError.ErrorDetails = "You deleted a non-existent public id photo";
                    return BadRequest(apiError);
                } 
            }

            property.Photos.Remove(photo);

            if (await uow.SaveAsync()) return Ok();

            apiError.ErrorCode = BadRequest().StatusCode;
            apiError.ErrorMessage = "Failed to delete photo";
            apiError.ErrorDetails = "An unknown error occured";
            return BadRequest(apiError);
        }
    }
}
