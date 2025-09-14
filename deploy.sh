#!/bin/bash

# Cloudflare Workers Deployment Script
# This script helps deploy your Opal Tools to Cloudflare Workers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if wrangler is installed
check_wrangler() {
    if ! command -v wrangler &> /dev/null; then
        print_error "Wrangler CLI is not installed. Please install it first:"
        echo "npm install -g wrangler"
        exit 1
    fi
    print_success "Wrangler CLI is installed"
}

# Check if user is authenticated
check_auth() {
    if ! wrangler whoami &> /dev/null; then
        print_error "You are not authenticated with Cloudflare. Please run:"
        echo "wrangler login"
        exit 1
    fi
    print_success "Authenticated with Cloudflare"
}

# Install dependencies
install_deps() {
    print_status "Installing dependencies..."
    if [ -f "package.json" ]; then
        npm install
        print_success "Dependencies installed"
    else
        print_warning "No package.json found, skipping npm install"
    fi
}

# Deploy to specific environment
deploy_env() {
    local env=$1
    print_status "Deploying to $env environment..."
    
    if [ "$env" = "production" ]; then
        wrangler deploy --env production
    elif [ "$env" = "staging" ]; then
        wrangler deploy --env staging
    else
        wrangler deploy
    fi
    
    print_success "Deployed to $env environment"
}

# Set secrets
set_secrets() {
    print_status "Setting up secrets..."
    echo "Enter your API key (press Enter to skip):"
    read -r api_key
    if [ -n "$api_key" ]; then
        echo "$api_key" | wrangler secret put API_KEY
        print_success "API_KEY secret set"
    fi
}

# Main deployment function
deploy() {
    local env=${1:-development}
    
    print_status "Starting deployment process..."
    
    check_wrangler
    check_auth
    install_deps
    
    if [ "$env" != "development" ]; then
        set_secrets
    fi
    
    deploy_env "$env"
    
    print_success "Deployment completed successfully!"
    print_status "Your worker is now live at: https://my-opal-csharp-tools-$env.your-subdomain.workers.dev"
}

# Development mode
dev() {
    print_status "Starting development server..."
    check_wrangler
    install_deps
    wrangler dev
}

# Show help
show_help() {
    echo "Cloudflare Workers Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND] [ENVIRONMENT]"
    echo ""
    echo "Commands:"
    echo "  deploy [env]    Deploy to specified environment (development, staging, production)"
    echo "  dev            Start development server"
    echo "  help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy production"
    echo "  $0 deploy staging"
    echo "  $0 dev"
}

# Main script logic
case "${1:-help}" in
    deploy)
        deploy "$2"
        ;;
    dev)
        dev
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
