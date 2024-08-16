using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using WebAPI.Dtos;
using WebAPI.Interfaces;

namespace WebAPI.Data.Proxy
{
    public class CachedCityProxy : ICachedCityProxy
    {
        private readonly DataContext dc;
        private readonly IMemoryCache cache;
        private readonly IMapper mapper;

        public CachedCityProxy(DataContext dc, IMemoryCache cache, IMapper mapper)
        {
            this.dc = dc;
            this.cache = cache;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<CityDto>> LoadFromCache()
        {
            var cachedData = cache.Get("cities") as IEnumerable<CityDto>;

            if (cachedData == null)
            {
                cachedData = await GetCities();

                var cacheEntryOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(5)
                };

                cache.Set("cities", cachedData, cacheEntryOptions);
            }


            return cachedData;
        }


        public async Task<IEnumerable<PropertyStatsDto>> FilterFromCache(string filterWord, int amount, int sellRent)
        {
            var cachedData = cache.Get("sugestions") as IEnumerable<PropertyStatsDto>;

            if(cachedData == null)
            {
                cachedData = await GetSugestions();

                var cacheEntryOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(5)
                };

                cache.Set("sugestions", cachedData, cacheEntryOptions);
            }


            return cachedData;
        }

        private async Task<IEnumerable<PropertyStatsDto>> GetSugestions()
        {
            return await dc.PropertyStatsView.ToListAsync();
        }

        private async Task<List<CityDto>> GetCities()
        {
            var cities = await dc.Cities.ToListAsync();
            var citiesDto = mapper.Map<List<CityDto>>(cities);

            return citiesDto;
        }
    }
}
