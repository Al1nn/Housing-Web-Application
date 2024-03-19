using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IPropertyRepository
    {
        Task<IEnumerable<Property>> GetPropertiesAsync(int sellRent);

        Task<IEnumerable<Property>> GetUserPropertiesAsync(int userId);

        Task<Property> GetPropertyDetailAsync(int id);

        Task<Property> GetPropertyByIdAsync(int id);
        
        void AddProperty(Property property);

        void DeleteProperty(int id);

        void UpdateProperty(Property property);
    }
}
