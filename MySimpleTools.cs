using OpalToolsSDK;
using Optimizely.Opal.Tools;
// For ParameterType if needed, though often inferred


namespace MyOpalCSharpTools
{
    // Define a simple parameter model
    public class GreetingParams
    {
        public string Name { get; set; }
        public string Language { get; set; } = "en"; // Default value
    }

    // Define a class to hold your static tool methods
    public static class MySimpleTools
    {
        [Tool(name: "hello_world", description: "A simple tool that returns a greeting.")]
        public static object HelloWorldTool(GreetingParams parameters)
        {
            string greeting;
            if (parameters.Language == "es")
            {
                greeting = $"¡Hola, {parameters.Name} desde la herramienta Opal!";
            }
            else
            {
                greeting = $"Hello, {parameters.Name} from Opal Tool!";
            }
            return new { message = greeting };
        }

        // Example of a tool with no parameters
        [Tool(name: "get_current_time", description: "Returns the current UTC time.")]
        public static object GetCurrentTimeTool()
        {
            return new { currentTimeUtc = DateTime.UtcNow.ToString("o") }; // ISO 8601 format
        }
    }
}