using WebAPI.Dtos;
using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface ICityRepository
    {
        Task<IEnumerable<City>> GetCitiesAsync();

        Task<IEnumerable<PropertyStatsDto>> GetCitySugestions();

        void AddCity(City city);

        void DeleteCity(int CityId);

        Task<City> FindCity(int id); 
    }
}
