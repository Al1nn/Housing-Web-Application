using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WebAPI.Data;
using WebAPI.Extensions;
using WebAPI.Helpers;
using WebAPI.Interfaces;
using WebAPI.Middlewares;


var builder = WebApplication.CreateBuilder(args);

builder.Host.ConfigureHostConfiguration(webBuilder => { webBuilder.AddEnvironmentVariables(prefix: "MYFIRSTAPP_"); });

// Add services to the container.
var connectionBuilder = new SqlConnectionStringBuilder(
        builder.Configuration.GetConnectionString("Default"));

connectionBuilder.Password = builder.Configuration.GetSection("DBPassword").Value;

var connectionString = connectionBuilder.ConnectionString;


builder.Services.AddDbContext<DataContext>( options => options.UseSqlServer(connectionString) );
builder.Services.AddControllers().AddNewtonsoftJson();
builder.Services.AddCors();
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




// Configure the HTTP request pipeline.


app.ConfigureExceptionHandler(app.Environment);

//app.ConfigureBuiltInExceptionHandler(app.Environment);

app.UseSwagger();

app.UseSwaggerUI();

app.UseRouting();


app.UseCors(m => m.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
