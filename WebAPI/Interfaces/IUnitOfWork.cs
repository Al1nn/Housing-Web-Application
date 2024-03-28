namespace WebAPI.Interfaces
{
    public interface IUnitOfWork
    {
        ICityRepository CityRepository { get; }

        //Add more Repositories 
        IUserImageRepository UserImageRepository { get; }

        IPropertyRepository PropertyRepository { get; }

        IPropertyTypeRepository PropertyTypeRepository { get; }

        IFurnishingTypeRepository FurnishingTypeRepository { get; }


        public Task<bool> SaveAsync();
    }
}
