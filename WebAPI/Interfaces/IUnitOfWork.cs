namespace WebAPI.Interfaces
{
    public interface IUnitOfWork
    {
        ICityRepository CityRepository { get; }

        //Add more Repositories 
        IUserRepository UserRepository { get; }

        IPropertyRepository PropertyRepository { get; }

        IPropertyTypeRepository PropertyTypeRepository { get; }

        IFurnishingTypeRepository FurnishingTypeRepository { get; }

     

        public Task<bool> SaveAsync();
    }
}
