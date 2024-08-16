using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using WebAPI.Dtos;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Data.Proxy
{
    public class CachedCityProxy : ICityRepository
    {
        private readonly ICityRepository cityRepository;
        private readonly IMemoryCache cache;


        public CachedCityProxy(ICityRepository cityRepository)
        {
            this.cityRepository = cityRepository;
            this.cache = cache;
        }

        public async Task<IEnumerable<City>> GetCitiesAsync()
        {
            var cachedData = cache.Get("cities") as IEnumerable<City>;

            if(cachedData ==  null)
            {
                cachedData = await cityRepository.GetCitiesAsync();

                var cacheEntryOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(5)
                };

                cache.Set("cities", cachedData, cacheEntryOptions);
            }

            return cachedData;
        }

        public async Task<IEnumerable<PropertyStatsDto>> GetCitySugestions()
        {
            var cachedData = cache.Get("sugestions") as IEnumerable<PropertyStatsDto>;

            if (cachedData == null)
            {
                cachedData = await cityRepository.GetCitySugestions();

                var cacheEntryOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(5)
                };

                cache.Set("cities", cachedData, cacheEntryOptions);
            }

            return cachedData;
        }

        public void AddCity(City city)
        {
            cityRepository.AddCity(city);
        }

        public void DeleteCity(int CityId)
        {
            cityRepository.DeleteCity(CityId);
        }

        public async Task<City> FindCity(int id)
        {
            return await cityRepository.FindCity(id);    
        }

        
    }
}
