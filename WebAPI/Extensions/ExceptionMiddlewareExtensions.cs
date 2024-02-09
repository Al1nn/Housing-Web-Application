using Microsoft.AspNetCore.Diagnostics;
using Microsoft.Extensions.Hosting;
using System.Net;

namespace WebAPI.Extensions
{
    public static class ExceptionMiddlewareExtensions
    {
        public static void ConfigureExceptionHandler(this IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else if (env.IsProduction())
            {
                app.UseDeveloperExceptionPage();
                app.UseExceptionHandler(
                    options =>
                    {
                        options.Run(
                                async context =>
                                {
                                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                                    var ex = context.Features.Get<IExceptionHandlerFeature>();
                                    if (ex != null)
                                    {
                                        await context.Response.WriteAsync(ex.Error.Message);
                                    }
                                }
                            );
                    }
                    );
            }


        }


    }
}
