
using System.Xml.Serialization;
using System.Linq;
using Microsoft.Extensions.Options;
using WebAPI.XMLModels;
using WebAPI.Models;
using WebAPI.Interfaces;
using WebAPI.Data;

namespace WebAPI.Services
{
    public class CurrentRatesService : BackgroundService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<CurrentRatesService> _logger;
        private readonly IServiceProvider _serviceProvider;
        private TimeSpan _scheduledTime;
        private Timer _timer;

        public CurrentRatesService(IConfiguration configuration, ILogger<CurrentRatesService> logger, IServiceProvider serviceProvider)
        {
            _configuration = configuration;
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var scheduledHour = _configuration.GetSection("AppSettings:ScheduledHour").Value;

            if (TimeSpan.TryParse(scheduledHour, out var parsedTime))
            {
                _scheduledTime = parsedTime;
                _logger.LogInformation($"Scheduled Time {_scheduledTime}");
            }
            else
            {
                _logger.LogError("Error Parsing Scheduled Time, scheduled Time will be set to 1 hour");
                _scheduledTime = TimeSpan.FromHours(1);
            }

            await FetchAndOutputXmlRatesAsync();

            ScheduleNextExecution();

            await Task.Delay(Timeout.Infinite, stoppingToken);
            
        }

        private void ScheduleNextExecution()
        {
            var currentTime = DateTime.Now.TimeOfDay;
            TimeSpan delay;

            if (currentTime < _scheduledTime)
            {
                delay = _scheduledTime - currentTime; // Azi
            }
            else
            {
                delay = (TimeSpan.FromHours(24) - currentTime) + _scheduledTime; //Maine
            }

            _timer = new Timer(async state =>
            {
                await FetchAndOutputXmlRatesAsync();
                ScheduleNextExecution();
            }, null, delay, Timeout.InfiniteTimeSpan); 
        }

        private async Task FetchAndOutputXmlRatesAsync()
        {
            try
            {
                string xmlData;

                using (var httpClient = new HttpClient())
                {
                    var url = "https://www.bnr.ro/nbrfxrates.xml";
                    xmlData = await httpClient.GetStringAsync(url);

                    XmlSerializer serializer = new XmlSerializer(typeof(DataSet));
                    DataSet exchange;

                    using (StringReader reader = new StringReader(xmlData))
                    {
                        exchange = (DataSet)serializer.Deserialize(reader);
                    }

                    var rates = exchange.Body.Cube.Rate;

                    foreach(var rate in rates) { 
                        if(rate.currency == "EUR" || rate.currency == "USD" || rate.currency == "GBP" || rate.currency == "MDL" || rate.currency == "BGN")
                        {
                            _logger.LogInformation("exchange for {Val}: {Val}", rate.currency, rate.Value );

                            using(var scope = _serviceProvider.CreateScope())
                            {
                                IUnitOfWork uow = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

                                Currency currency = new Currency();
                                currency.Name = rate.currency;
                                currency.Value = rate.Value;
                                currency.LastUpdatedOn = DateTime.Now;
                                currency.LastUpdatedBy = 1;
                                uow.CurrencyRepository.UpdateCurrency(currency);

                                await uow.SaveAsync();
                            }

                            



                        }
                    }

                    

                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching or processing the XML rates.");
            }
        }
    }
}
