using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface ICurrencyRepository
    {
        void UpdateCurrency(Currency currency);
    }
}
