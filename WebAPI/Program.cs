using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WebAPI.Data;
using WebAPI.Extensions;
using WebAPI.Helpers;
using WebAPI.Interfaces;
using WebAPI.Services;



var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables(prefix: "MYFIRSTAPP_");


string dbCredentials = "";
string dbPassword = "";
if (builder.Environment.IsProduction())
{
    dbCredentials = "ConnectionStrings:Production";
    dbPassword = "ConnectionStrings:DBPassword_Production";
}
else if (builder.Environment.IsDevelopment())
{
    dbCredentials = "ConnectionStrings:Development";
    dbPassword = "ConnectionStrings:DBPassword_Development";
}

var connectionBuilder = new SqlConnectionStringBuilder(
        builder.Configuration.GetConnectionString(dbCredentials));


connectionBuilder.Password = builder.Configuration.GetSection(dbPassword).Value;

var connectionString = connectionBuilder.ConnectionString;




builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(connectionString,
     sqlServerOptionsAction: sqlOptions =>
     {
         sqlOptions.EnableRetryOnFailure(
             maxRetryCount: 5,
             maxRetryDelay: TimeSpan.FromSeconds(30),
             errorNumbersToAdd: null);
     }
);

});



builder.Services.AddControllers().AddNewtonsoftJson((x) =>
{
    x.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
    x.SerializerSettings.MissingMemberHandling = Newtonsoft.Json.MissingMemberHandling.Ignore;
});

builder.Services.AddMemoryCache();

builder.Services.AddCors();

builder.Services.AddHostedService<CurrentRatesService>();


builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();



var secretKey = builder.Configuration.GetSection("AppSettings:Key").Value;
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)

    .AddJwtBearer(opt => opt.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateIssuer = false,
        ValidateAudience = false,
        IssuerSigningKey = key
    });

builder.Services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



var app = builder.Build();

app.ConfigureExceptionHandler(app.Environment);

app.UseSwagger();

app.UseSwaggerUI();

app.UseRouting();

app.UseFileServer();

app.UseHsts();

app.UseHttpsRedirection();

app.UseCors(m => m.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.UseDefaultFiles();

app.UseStaticFiles();

app.MapControllers();

app.Run();
