using Microsoft.Extensions.Diagnostics.HealthChecks;
using Optimizely.Opal.Tools;
using OpalToolsSDK;


namespace MyOpalCSharpTools
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();



            builder.Services.AddOpalToolService();
            // Fix: Use the correct method to register Opal Tools service
            //builder.Services.AddSingleton<IOpalToolsService, OpalToolsService>(); // Replace AddOpalToolsService with explicit registration
            //IServiceCollection serviceCollection = builder.Services.AddScoped<MySimpleTools>();

            var app = builder.Build();


            // 1) Add the Opal Tools Service to the pipeline
            //var toolsService = app.AddOpalToolsService();

            // 2) Register all tools from the assembly that contains MySimpleTools
            //    Works whether MySimpleTools.cs is in this web project or a referenced class library.
            //toolsService.RegisterToolsFromAssembly(typeof(MySimpleTools).Assembly, app);

           // toolsService.RegisterToolsFromExecutingAssembly(app);

            // (Optional) A friendly root that redirects to /discovery so you can sanity‑check locally.
           // app.MapGet("/", (HttpContext _) => Results.Redirect("/discovery"));


            if (app.Environment.IsDevelopment())
            {
                //app.UseSwagger();
                //app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            // Register Opal Tools and add its middleware
            //var toolsService = app.Services.GetRequiredService<IOpalToolsService>();

            // Register all tools from the current assembly, including MySimpleTools
            //toolsService.RegisterToolsFromExecutingAssembly(app);


            // Register Opal Tools SDK
            //builder.Services.AddOpalTool< MySimpleTools>();
            //builder.Services.AddOpalToolAssembly(typeof(MyOpalCSharpTools.MySimpleTools).Assembly);

            //builder.Services.AddOpalToolService();
            // Fix: Replace typeof(MySimpleTools) with typeof(MySimpleTools).Assembly to pass an Assembly instance
            //tools.RegisterToolsFromAssembly(app, typeof(MySimpleTools).Assembly);


            var tools = app.AddOpalToolsService();
            tools.RegisterToolsFromAssembly(app,typeof(MySimpleTools).Assembly);



            //app.MapOpalTools();

            app.Run();
        }
    }
}