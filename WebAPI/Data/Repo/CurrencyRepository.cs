using Microsoft.EntityFrameworkCore;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Data.Repo
{
    public class CurrencyRepository : ICurrencyRepository
    {
        private readonly DataContext dc;

        public CurrencyRepository(DataContext dc)
        {
            this.dc = dc;
        }

        public void AddCurrency(Currency currency)
        {
           dc.Currencies.Add(currency);
        }
    }
}
