using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IPropertyRepository
    {
        Task<IEnumerable<Property>> GetPropertiesAsync(int sellRent);

        Task<IEnumerable<Property>> GetPropertiesPageAsync(int sellRent, int pageNumber, int pageSize);

        Task<IEnumerable<Property>> GetUserPropertiesAsync(int userId);

        Task<IEnumerable<Property>> GetUserPropertiesPageAsync(int userId, int pageNumber, int pageSize);

        Task<Property> GetPropertyDetailAsync(int id);

        Task<Property> GetPropertyByIdAsync(int id);

        Task<int> GetPropertyCountByUserAsync(int userId);
        
        void AddProperty(Property property);

        void DeleteProperty(int id);

        void UpdateProperty(Property property);
    }
}
