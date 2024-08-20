namespace WebAPI.Interfaces
{
    public interface IUnitOfWork
    {
        ICityRepository CityRepository { get; }

        IUserImageRepository UserImageRepository { get; }

        IPropertyRepository PropertyRepository { get; }

        IPropertyTypeRepository PropertyTypeRepository { get; }

        IFurnishingTypeRepository FurnishingTypeRepository { get; }

        ITreeRepository TreeRepository { get; }

        public Task<bool> SaveAsync();

        public Task<bool> SaveTreeAsync();
    }
}
