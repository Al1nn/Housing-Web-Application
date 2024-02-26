using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IContactRepository
    {
        Task<IEnumerable<Contact>> GetContactsAsync();

        void AddContact(Contact contact);

        void DeleteContact(int ContactId);

        Task<Contact> FindContact(int id);
    }
}
