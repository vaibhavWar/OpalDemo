import { Router } from 'itty-router';

// Create a new router
const router = Router();

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle CORS preflight requests
router.options('*', () => {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
});

// Health check endpoint
router.get('/health', () => {
  return new Response(JSON.stringify({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: ENVIRONMENT || 'development'
  }), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
});

// Root endpoint
router.get('/', () => {
  return new Response(JSON.stringify({
    message: 'MyOpalCSharpTools Cloudflare Worker',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      discovery: '/discovery',
      tools: '/tools'
    }
  }), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
});

// Discovery endpoint for Opal Tools
router.get('/discovery', () => {
  const tools = [
    {
      name: 'hello_world',
      description: 'A simple tool that returns a greeting.',
      parameters: {
        type: 'object',
        properties: {
          Name: {
            type: 'string',
            description: 'The name to greet'
          },
          Language: {
            type: 'string',
            description: 'The language for the greeting (en, es)',
            default: 'en'
          }
        },
        required: ['Name']
      }
    },
    {
      name: 'get_current_time',
      description: 'Returns the current UTC time.',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  ];

  return new Response(JSON.stringify({
    tools: tools,
    version: '1.0.0'
  }), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
});

// Tools execution endpoint
router.post('/tools', async (request) => {
  try {
    const body = await request.json();
    const { tool_name, parameters } = body;

    let result;

    switch (tool_name) {
      case 'hello_world':
        result = await executeHelloWorldTool(parameters);
        break;
      case 'get_current_time':
        result = await executeGetCurrentTimeTool();
        break;
      default:
        return new Response(JSON.stringify({
          error: `Unknown tool: ${tool_name}`
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
    }

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
});

// Tool execution functions
async function executeHelloWorldTool(parameters) {
  const { Name, Language = 'en' } = parameters;
  
  let greeting;
  if (Language === 'es') {
    greeting = `¡Hola, ${Name} desde la herramienta Opal!`;
  } else {
    greeting = `Hello, ${Name} from Opal Tool!`;
  }
  
  return { message: greeting };
}

async function executeGetCurrentTimeTool() {
  return { currentTimeUtc: new Date().toISOString() };
}

// 404 handler
router.all('*', () => {
  return new Response(JSON.stringify({
    error: 'Not Found',
    message: 'The requested endpoint was not found'
  }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
});

// Main worker event handler
export default {
  async fetch(request, env, ctx) {
    try {
      // Add environment variables to global scope
      globalThis.ENVIRONMENT = env.ENVIRONMENT || 'development';
      
      // Handle the request with the router
      return await router.handle(request, env, ctx);
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({
        error: 'Internal Server Error',
        message: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  },
};
