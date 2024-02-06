using Microsoft.AspNetCore.Mvc;
using WebAPI.Data.Repo;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CityController : ControllerBase
    {
        
        private readonly ICityRepository repository;

        public CityController( ICityRepository repository)
        {
            this.repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetCities()
        {
            var cities = await repository.GetCitiesAsync();
            return Ok(cities);
        }


        [HttpPost("post")]
        public async Task<IActionResult> AddCity(City city)
        {
            //City city = new City();
            //city.Name = cityName;
            repository.AddCity(city);
            await repository.SaveAsync();
            return StatusCode(201);
        }


        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteCity(int id)
        {
            repository.DeleteCity(id);
            await repository.SaveAsync();
            return Ok(id);
        }
    }
}
