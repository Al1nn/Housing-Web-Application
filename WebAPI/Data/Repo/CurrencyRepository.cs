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

        public void UpdateCurrency(Currency currency)
        {
            Console.WriteLine("Updating Currencies");


            var existingCurrency = dc.Currencies.FirstOrDefault(c => c.Name == currency.Name);

            if (existingCurrency != null)
            {
                existingCurrency.Value = currency.Value;
                existingCurrency.LastUpdatedOn = currency.LastUpdatedOn;
                existingCurrency.LastUpdatedBy = currency.LastUpdatedBy;
                dc.Currencies.Update(existingCurrency);
            }
            else
            {
                dc.Currencies.Add(currency);
            }


        }
    }
}
