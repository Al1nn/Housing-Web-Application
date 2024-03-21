using WebAPI.Data.Repo;
using WebAPI.Interfaces;

namespace WebAPI.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext dc;
        private ICityRepository _cityRepository;
        private IUserRepository _userRepository;
        private IPropertyRepository _propertyRepository;

        public UnitOfWork(DataContext dc)
        {
            this.dc = dc;
        }

        public ICityRepository CityRepository => new CityRepository(dc);

        public IUserRepository UserRepository => new UserRepository(dc);
        

        public IPropertyRepository PropertyRepository => new PropertyRepository(dc);
        

        public IPropertyTypeRepository PropertyTypeRepository => new PropertyTypeRepository(dc);

        public IFurnishingTypeRepository FurnishingTypeRepository => new FurnishingTypeRepository(dc);
     
        public IUserProfileImageRepository UserProfileImageRepository => new UserProfileImageRepository(dc);

        // Add more repos


        public async Task<bool> SaveAsync()
        {
            return await dc.SaveChangesAsync() > 0;
        }
    }
}
