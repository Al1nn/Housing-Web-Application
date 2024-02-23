using Microsoft.EntityFrameworkCore;
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
          

        }

        public void DeleteProperty(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Property>> GetPropertiesAsync(int sellRent)
        {
            var properties = await dc.Properties
                            .Include(p => p.PropertyType)
                            .Include(p => p.FurnishingType)
                            .Include(p=> p.City)
                            .Include(p=> p.Contact)
                            .Include(p=> p.User)
                            .Include(p=> p.Photos)
                            .Where(p => p.SellRent == sellRent)
                            .ToListAsync();
            return properties;
        }
    }
}
