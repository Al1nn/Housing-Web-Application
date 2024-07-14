using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface ICityRepository
    {
        Task<IEnumerable<City>> GetCitiesAsync();

        Task<IEnumerable<City>> FilterCitiesAsync(string filterWord, int amount);

        void AddCity(City city);

        void DeleteCity(int CityId);

        Task<City> FindCity(int id); 
    }
}
