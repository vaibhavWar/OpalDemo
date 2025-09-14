# Cloudflare Workers Deployment Guide

## Prerequisites

1. **Node.js 18+** - Install from [nodejs.org](https://nodejs.org/)
2. **Cloudflare Account** - Sign up at [cloudflare.com](https://cloudflare.com)
3. **Wrangler CLI** - Install globally: `npm install -g wrangler`

## Setup Instructions

### 1. Authentication

```bash
# Login to Cloudflare
wrangler login

# Verify authentication
wrangler whoami
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp env.example .env.local

# Edit .env.local with your Cloudflare account details
# Get your Account ID from Cloudflare Dashboard > Workers & Pages > Account ID
# Generate API Token from Cloudflare Dashboard > My Profile > API Tokens
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Deploy

#### Development Deployment
```bash
# Deploy to development environment
npm run deploy

# Or use the deployment script
./deploy.sh deploy development
```

#### Staging Deployment
```bash
# Deploy to staging environment
npm run deploy:staging

# Or use the deployment script
./deploy.sh deploy staging
```

#### Production Deployment
```bash
# Deploy to production environment
npm run deploy:production

# Or use the deployment script
./deploy.sh deploy production
```

### 5. Development

```bash
# Start local development server
npm run dev

# Or use the deployment script
./deploy.sh dev
```

## Configuration

### Wrangler Configuration

The `wrangler.toml` file contains your worker configuration:

- **name**: Worker name (must be unique)
- **main**: Entry point file (worker.js)
- **compatibility_date**: Cloudflare Workers compatibility date
- **env**: Environment-specific configurations

### Environment Variables

Set environment variables using:

```bash
# Set secrets (encrypted)
wrangler secret put API_KEY

# List secrets
wrangler secret list

# Delete secrets
wrangler secret delete API_KEY
```

### Custom Domains

To use a custom domain:

1. Add your domain to Cloudflare
2. Update `wrangler.toml` with route configuration
3. Deploy with the new configuration

## API Endpoints

Your deployed worker will have these endpoints:

- `GET /` - Root endpoint with API information
- `GET /health` - Health check endpoint
- `GET /discovery` - Opal Tools discovery endpoint
- `POST /tools` - Execute Opal Tools

## Monitoring

### View Logs
```bash
# View real-time logs
npm run tail

# Or use wrangler directly
wrangler tail
```

### Analytics
- Visit Cloudflare Dashboard > Workers & Pages
- Select your worker
- View analytics and metrics

## Troubleshooting

### Common Issues

1. **Authentication Error**
   ```bash
   wrangler login
   ```

2. **Account ID Missing**
   - Get Account ID from Cloudflare Dashboard
   - Update `wrangler.toml` or environment variables

3. **Worker Name Conflict**
   - Change the name in `wrangler.toml`
   - Ensure the name is unique across Cloudflare

4. **Build Errors**
   - Check Node.js version (18+)
   - Run `npm install` to ensure dependencies are installed

### Debug Mode

```bash
# Enable debug logging
WRANGLER_LOG=debug wrangler dev
```

## GitHub Actions

The included GitHub Actions workflow automatically deploys:

- **Staging**: When pushing to `develop` branch
- **Production**: When pushing to `main` branch

### Required Secrets

Add these secrets to your GitHub repository:

- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

## Security

- Use `wrangler secret put` for sensitive data
- Never commit API keys or tokens to version control
- Use environment-specific configurations
- Enable Cloudflare security features (WAF, DDoS protection)

## Performance

- Cloudflare Workers have a 10ms CPU time limit per request
- Use KV storage for persistent data
- Use Durable Objects for stateful applications
- Optimize your code for the Workers runtime

## Support

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Opal Tools Documentation](https://docs.opal.ai/)
