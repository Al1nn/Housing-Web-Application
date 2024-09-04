using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface ICurrencyRepository
    {
        void AddCurrency(Currency currency);
    }
}
