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

        public ICityRepository CityRepository
        {
            get
            {
                if (_cityRepository == null)
                {
                    _cityRepository = new CityRepository(dc);
                }
                return _cityRepository;
            }
        }

        public IUserRepository UserRepository
        {
            get
            {
                if (_userRepository == null)
                {
                    _userRepository = new UserRepository(dc);
                }
                return _userRepository;
            }
        }

        public IPropertyRepository PropertyRepository
        {
            get
            {
                if (_propertyRepository == null)
                {
                    _propertyRepository = new PropertyRepository(dc);
                }
                return _propertyRepository;
            }
        }

        // Add more repos
        public async Task<bool> SaveAsync()
        {
            return await dc.SaveChangesAsync() > 0;
        }
    }
}
