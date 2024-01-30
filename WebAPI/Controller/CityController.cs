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
            return new string[] { "New York", "California", "Texas"
            , "Kansas", "Los Angeles", "Miami"
            , "Washington","San Francisco","Seatles"
            ,"Philadelphia","Vancouver","New Jersey" };
        }

    }
}