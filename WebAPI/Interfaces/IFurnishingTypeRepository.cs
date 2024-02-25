using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IFurnishingTypeRepository
    {
        public Task<IEnumerable<FurnishingType>> GetFurnishingTypesAsync();
    }
}
