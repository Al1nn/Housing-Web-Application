﻿using AutoMapper;
using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using WebAPI.Dtos;
using WebAPI.Interfaces;
using WebAPI.Models;


namespace WebAPI.Controllers
{

    [Authorize]

    public class CityController : BaseController
    {
        private readonly IUnitOfWork uow;
        private readonly IMapper mapper;
        private readonly IMemoryCache cache;


        public CityController(IUnitOfWork uow, IMapper mapper, IMemoryCache cache)
        {
            this.uow = uow;
            this.mapper = mapper;
            this.cache = cache;
        }

        [HttpGet("cities")]
        [AllowAnonymous]
        public async Task<IActionResult> LoadFromCache()
        {

            var citiesData = cache.Get("cities") as IEnumerable<CityDto>;

            if (citiesData == null)
            {

                citiesData = await GetCities();

                var cacheEntryOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30),
                    SlidingExpiration = TimeSpan.FromMinutes(30),
                };

                cache.Set("cities", citiesData, cacheEntryOptions);
            }

            return Ok(citiesData);
        }

        [HttpGet("cities/{filterWord}/{amount}/{sellRent}")]
        [AllowAnonymous]
        public async Task<IActionResult> FilterFromCache(string filterWord, int amount, int sellRent)
        {
            var citiesData = cache.Get("sugestions") as IEnumerable<PropertyStatsDto>;

            if (citiesData == null)
            {

                citiesData = await GetSugestions();

                var cacheEntryOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(5)
                };

                cache.Set("sugestions", citiesData, cacheEntryOptions);
            }

            var filteredData = citiesData
                                .Where(city => city.City.Contains(filterWord, StringComparison.OrdinalIgnoreCase) ||
                                               city.Country.Contains(filterWord, StringComparison.OrdinalIgnoreCase))
                                .Take(amount)
                                .Select(city => new
                                {
                                    city.Id,
                                    city.City,
                                    city.Country,
                                    SellRentCount = sellRent == 1 ? city.SellCount : city.RentCount
                                })
                                .ToList();




            return Ok(filteredData);
        }

        private async Task<IEnumerable<PropertyStatsDto>> GetSugestions()
        {
            var sugestions = await uow.PropertyRepository.GetPropertyStatsAsync();
            return sugestions;
        }


        private async Task<List<CityDto>> GetCities()
        {
            var cities = await uow.CityRepository.GetCitiesAsync();
            var citiesDto = mapper.Map<List<CityDto>>(cities);

            return citiesDto;
        }



        [HttpPost("post")]
        public async Task<IActionResult> AddCity(CityDto cityDto)
        {
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

            var cityFromDb = await uow.CityRepository.FindCity(id);
            if (cityFromDb == null) return BadRequest("Update not Allowed");
            cityFromDb.LastUpdatedBy = 1;
            cityFromDb.LastUpdatedOn = DateTime.Now;

            mapper.Map(cityDto, cityFromDb);


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


    }
}