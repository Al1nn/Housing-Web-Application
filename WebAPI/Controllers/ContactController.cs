using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Dtos;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : BaseController
    {
        private readonly IUnitOfWork uow;
        private readonly IMapper mapper;

        public ContactController(IUnitOfWork uow, IMapper mapper)
        {
            this.uow = uow;
            this.mapper = mapper;
        }

        [HttpGet("list")]
        [AllowAnonymous]
        public async Task<IActionResult> GetContacts()
        {
            var contacts = await uow.ContactRepository.GetContactsAsync();
            var contactsDto = mapper.Map<IEnumerable<ContactDto>>(contacts);
            return Ok(contactsDto);
        }
    }
}
