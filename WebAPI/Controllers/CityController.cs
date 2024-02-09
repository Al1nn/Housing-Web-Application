using AutoMapper;
using Azure;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Dtos;
using WebAPI.Interfaces;
using WebAPI.Models;


namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CityController : ControllerBase
    {
        private readonly IUnitOfWork uow;
        private readonly IMapper mapper;

        public CityController(IUnitOfWork uow, IMapper mapper)
        {
            this.uow = uow;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetCities()
        {
            //throw new UnauthorizedAccessException("You are not allowed to access this content");
            var cities = await uow.CityRepository.GetCitiesAsync();
            var citiesDto = mapper.Map<IEnumerable<CityDto>>(cities);

            //var citiesDto = from c in cities
            //                select new CityDto() 
            //                { Id = c.Id,
            //                    Name = c.Name };



            return Ok(citiesDto);
        }

        [HttpGet("filter/{filterWord}")]
        public async Task<IActionResult> GetCitiesFiltered(string filterWord)
        {
            var cities = await uow.CityRepository.GetCitiesAsync();
            // var citiesDto = mapper.Map<IEnumerable<CityDto>>(cities);


            //Metode LINQ pentru filtrare City
           

            var filteredCities = from c in cities
                                 where c.Name.ToLower().Contains(filterWord.ToLower())
                                 || c.Country.ToLower().Contains(filterWord.ToLower())
                                 || c.PropertyType.ToLower().Contains(filterWord.ToLower()) 
                                 select c;
            return  Ok(filteredCities);
        }


        [HttpPost("post")]
        public async Task<IActionResult> AddCity(CityDto cityDto)
        {
            //City city = new City();
            //city.Name = cityName;
            //var city = new City
            //{
            //    Name = cityDto.Name,
            //    LastUpdatedBy = 1,
            //    LastUpdatedOn = DateTime.Now,
            //};

            var city = mapper.Map<City>(cityDto);
            city.LastUpdatedBy = 1;
            city.LastUpdatedOn = DateTime.Now;

            uow.CityRepository.AddCity(city);
            await uow.SaveAsync();
            return StatusCode(201);
        }


        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteCity(int id)
        {
            uow.CityRepository.DeleteCity(id);
            await uow.SaveAsync();
            return Ok(id);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateCity(int id, CityDto cityDto)
        {
         
                if (id != cityDto.Id) return BadRequest("Update not allowed");

                var cityFromDb = await  uow.CityRepository.FindCity(id);
                if (cityFromDb == null) return BadRequest("Update not Allowed");
                cityFromDb.LastUpdatedBy = 1;
                cityFromDb.LastUpdatedOn = DateTime.Now;

                mapper.Map(cityDto, cityFromDb);

                throw new Exception("Some unknown error occured");
                await uow.SaveAsync();

                return StatusCode(200);
           
        }

        [HttpPut("updateCityName/{id}")]
        public async Task<IActionResult> UpdateCity(int id, CityUpdateDto cityDto)
        {
            var cityFromDb = await uow.CityRepository.FindCity(id);
            cityFromDb.LastUpdatedBy = 1;
            cityFromDb.LastUpdatedOn = DateTime.Now;

            mapper.Map(cityDto, cityFromDb);
            await uow.SaveAsync();

            return StatusCode(200);
        }


        [HttpPatch("update/{id}")]
        public async Task<IActionResult> UpdateCityPatch(int id, JsonPatchDocument<City> cityToPatch)
        {
            var cityFromDb = await uow.CityRepository.FindCity(id);
            cityFromDb.LastUpdatedBy = 1;
            cityFromDb.LastUpdatedOn = DateTime.Now;

            cityToPatch.ApplyTo(cityFromDb, ModelState);
            await uow.SaveAsync();

            return StatusCode(200);
        }

        // Post api/city/add?cityname=Miami
        // Post api/city/add/Los Angeles
        // [HttpPost("add")]
        // [HttpPost("add/{cityname}")]
        // public async Task<IActionResult> AddCity(string cityName)
        // {
        //     City city = new City();
        //     city.Name = cityName;
        //     await dc.Cities.AddAsync(city);
        //     await dc.SaveChangesAsync();
        //     return Ok(city);
        // }
    }
}
