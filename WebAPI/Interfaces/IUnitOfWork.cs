namespace WebAPI.Interfaces
{
    public interface IUnitOfWork
    {
        ICityRepository CityRepository { get; }

        IUserRepository UserRepository { get; }

        IPropertyRepository PropertyRepository { get; }

        IPropertyTypeRepository PropertyTypeRepository { get; }

        IFurnishingTypeRepository FurnishingTypeRepository { get; }

        ITreeRepository TreeRepository { get; }

        ICurrencyRepository CurrencyRepository { get; }

        INotificationService NotificationService { get; }

        public Task<bool> SaveAsync();

        public Task<bool> SaveTreeAsync();
    }
}
