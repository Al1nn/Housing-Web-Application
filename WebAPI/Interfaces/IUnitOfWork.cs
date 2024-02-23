namespace WebAPI.Interfaces
{
    public interface IUnitOfWork
    {
        ICityRepository CityRepository { get; }

        //Add more Repositories 
        IUserRepository UserRepository { get; }

        IPropertyRepository PropertyRepository { get; }

        public Task<bool> SaveAsync();
    }
}
