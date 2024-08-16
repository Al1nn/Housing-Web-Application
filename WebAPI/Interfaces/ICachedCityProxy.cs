using WebAPI.Dtos;

namespace WebAPI.Interfaces
{
    public interface ICachedCityProxy
    {
        Task<IEnumerable<CityDto>> LoadFromCache();

        Task<IEnumerable<PropertyStatsDto>> FilterFromCache(string filterWord, int amount, int sellRent);
    }
}
