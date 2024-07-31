using Microsoft.EntityFrameworkCore;
using WebAPI.Dtos;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Data.Repo
{
    public class PropertyRepository : IPropertyRepository
    {
        private readonly DataContext dc;

        public PropertyRepository(DataContext dc)
        {
            this.dc = dc;
        }

        public void AddProperty(Property property)
        {
          dc.Properties.Add(property);
        }

        public void DeleteProperty(int id)
        {
            var property = dc.Properties
                            .Include(p => p.Photos)
                            .Where(p => p.Id == id)
                            .FirstOrDefault();
            dc.Properties.Remove(property);
        }

        public async Task<IEnumerable<Property>> GetUserPropertiesAsync(int userId)
        {
            var properties = await dc.Properties
                            .Include(p => p.PropertyType)
                            .Include(p => p.FurnishingType)
                            .Include(p => p.City)
                            .Include(p => p.User)
                            .Include(p => p.Photos)
                            .Where(p => p.PostedBy ==  userId)
                            .ToListAsync();
            return properties;
        }

        public async Task<IEnumerable<Property>> GetUserPropertiesPageAsync(int userId, int pageNumber, int pageSize)
        {
            var properties = await dc.Properties
                                .Include(p => p.PropertyType)
                                .Include(p => p.FurnishingType)
                                .Include(p => p.City)
                                .Include(p => p.User)
                                .Include(p => p.Photos)
                                .Where(p => p.PostedBy == userId)
                                .Skip((pageNumber - 1) * pageSize)
                                .Take(pageSize)
                                .ToListAsync();
            return properties;
        }

        public async Task<IEnumerable<Property>> GetPropertiesAsync(int sellRent)
        {
            var properties = await dc.Properties
                            .Include(p => p.PropertyType)
                            .Include(p => p.FurnishingType)
                            .Include(p=> p.City)
                            .Include(p=> p.User)
                            .Include(p=> p.Photos)
                            .Where(p => p.SellRent == sellRent)
                            .ToListAsync();
            return properties;
        }

        public async Task<IEnumerable<Property>> GetPropertiesPageAsync(int sellRent, int pageNumber, int pageSize)
        {
            var properties = await dc.Properties
                            .Include(p => p.PropertyType)
                            .Include(p => p.FurnishingType)
                            .Include(p => p.City)
                            .Include(p => p.User)
                            .Include(p => p.Photos)
                            .Where(p => p.SellRent == sellRent)
                            .Skip( (pageNumber - 1) * pageSize)
                            .Take(pageSize)
                            .ToListAsync();
            return properties;
        }




        public async Task<Property> GetPropertyByIdAsync(int id)
        {
            var properties = await dc.Properties
                            .Include(p => p.Photos)
                            .Where(p => p.Id == id)
                            .FirstOrDefaultAsync();
            return properties;
        }

        public async Task<Property> GetPropertyDetailAsync(int id)
        {
            var properties = await dc.Properties
                            .Include(p => p.PropertyType)
                            .Include(p => p.FurnishingType)
                            .Include(p => p.City)
                            .Include(p => p.User)
                            .Include(p => p.Photos)
                            .Where(p => p.Id == id)
                            .FirstAsync();
            return properties;
        }

        

        public void UpdateProperty(Property property)
        {
            dc.Properties.Update(property);
        }

        public async Task<int> GetPropertyCountByUserAsync(int userId)
        {
            int propertyCount = await dc.Properties
                                .Where(p => p.PostedBy == userId)   
                                .CountAsync();
            return propertyCount;
        }

        public async Task<IEnumerable<PropertyStatsDto>> GetPropertyStatsAsync()
        {
            return await dc.PropertyStatsView.ToListAsync();
        }
    }
}
