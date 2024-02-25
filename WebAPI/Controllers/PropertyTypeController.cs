using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Dtos;
using WebAPI.Interfaces;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyTypeController : BaseController
    {
        private readonly IUnitOfWork uow;
        private readonly IMapper mapper;

        public PropertyTypeController(IUnitOfWork uow, IMapper mapper)
        {
            this.uow = uow;
            this.mapper = mapper;
        }

        [HttpGet("list")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPropertyTypes()
        {
            var propertyTypes = await uow.PropertyTypeRepository.GetPropertyTypesAsync();
            var propertyTypesDto = mapper.Map<IEnumerable<KeyValuePairDto>>(propertyTypes);
            return Ok(propertyTypesDto);
        }
    }
}
