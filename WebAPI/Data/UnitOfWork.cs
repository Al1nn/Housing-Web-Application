
using WebAPI.Data.Repo;
using WebAPI.Interfaces;
using WebAPI.Services;

namespace WebAPI.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext dc;
        private readonly TreeContext tc;
   
        public UnitOfWork(DataContext dc, TreeContext tc)
        {
            this.dc = dc;
            this.tc = tc;
        }


        public ICityRepository CityRepository => new CityRepository(dc);
        

        public IUserRepository UserRepository => new UserRepository(dc);
        

        public IPropertyRepository PropertyRepository => new PropertyRepository(dc);
        

        public IPropertyTypeRepository PropertyTypeRepository => new PropertyTypeRepository(dc);


        public IFurnishingTypeRepository FurnishingTypeRepository => new FurnishingTypeRepository(dc);

        public ICurrencyRepository CurrencyRepository => new CurrencyRepository(dc);  

        // Add more repos
        public ITreeRepository TreeRepository => new TreeRepository(tc);


        public async Task<bool> SaveAsync()
        {
            return await dc.SaveChangesAsync() > 0;
        }

        public async Task<bool> SaveTreeAsync()
        {
            return await tc.SaveChangesAsync() > 0;
        }
    }
}
