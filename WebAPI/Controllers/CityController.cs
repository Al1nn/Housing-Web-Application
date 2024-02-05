using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CityController : ControllerBase
    {

        public CityController() { }

        [HttpGet]
        public string[] GetCities()
        {
            return ["Atlanta, America", "Narnia, Canada", "Los Angeles, America"];
        }

    }
}
