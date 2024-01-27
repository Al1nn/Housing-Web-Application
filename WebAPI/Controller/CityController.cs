using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class CityController : ControllerBase
    {
        public CityController()
        {

        }
        [HttpGet("")]
        public IEnumerable<string> Getstrings()
        {
            return new string[] { "Olanda", "Franta", "Spania", "Chicago", "Los Angeles" };
        }

    }
}