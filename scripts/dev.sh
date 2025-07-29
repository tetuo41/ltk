#!/bin/bash

# LTK Astro Development Script
# Usage: ./scripts/dev.sh [command]

set -e

PROJECT_NAME="ltk-astro"
DEV_IMAGE="${PROJECT_NAME}:dev"
PROD_IMAGE="${PROJECT_NAME}:prod"
DEV_CONTAINER="${PROJECT_NAME}-dev"
PROD_CONTAINER="${PROJECT_NAME}-prod"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if podman is available
check_podman() {
    if ! command -v podman &> /dev/null; then
        log_error "Podman is not installed or not in PATH"
        echo "Please install Podman: https://podman.io/getting-started/installation"
        exit 1
    fi
}

# Build development image
build_dev() {
    log_info "Building development image..."
    podman build -t $DEV_IMAGE --target development .
    log_success "Development image built successfully"
}

# Build production image
build_prod() {
    log_info "Building production image..."
    podman build -t $PROD_IMAGE --target production .
    log_success "Production image built successfully"
}

# Start development container
start_dev() {
    log_info "Starting development container..."
    
    # Stop existing container if running
    if podman ps -q -f name=$DEV_CONTAINER &> /dev/null; then
        log_warning "Stopping existing development container..."
        podman stop $DEV_CONTAINER
        podman rm $DEV_CONTAINER
    fi
    
    # Run development container
    podman run -d \
        --name $DEV_CONTAINER \
        -p 4321:4321 \
        -v "${PWD}":/app:Z \
        -v ltk-node-modules:/app/node_modules \
        $DEV_IMAGE
    
    log_success "Development container started at http://localhost:4321"
    log_info "Use 'podman logs -f $DEV_CONTAINER' to view logs"
}

# Start production container
start_prod() {
    log_info "Starting production container..."
    
    # Stop existing container if running
    if podman ps -q -f name=$PROD_CONTAINER &> /dev/null; then
        log_warning "Stopping existing production container..."
        podman stop $PROD_CONTAINER
        podman rm $PROD_CONTAINER
    fi
    
    # Run production container
    podman run -d \
        --name $PROD_CONTAINER \
        -p 8080:80 \
        $PROD_IMAGE
    
    log_success "Production container started at http://localhost:8080"
    log_info "Use 'podman logs -f $PROD_CONTAINER' to view logs"
}

# Stop development container
stop_dev() {
    log_info "Stopping development container..."
    if podman ps -q -f name=$DEV_CONTAINER &> /dev/null; then
        podman stop $DEV_CONTAINER
        podman rm $DEV_CONTAINER
        log_success "Development container stopped"
    else
        log_warning "Development container is not running"
    fi
}

# Stop production container
stop_prod() {
    log_info "Stopping production container..."
    if podman ps -q -f name=$PROD_CONTAINER &> /dev/null; then
        podman stop $PROD_CONTAINER
        podman rm $PROD_CONTAINER
        log_success "Production container stopped"
    else
        log_warning "Production container is not running"
    fi
}

# Show container logs
logs() {
    local container=${1:-$DEV_CONTAINER}
    log_info "Showing logs for $container..."
    podman logs -f $container
}

# Execute shell in container
shell() {
    local container=${1:-$DEV_CONTAINER}
    log_info "Opening shell in $container..."
    podman exec -it $container sh
}

# Show container status
status() {
    log_info "Container status:"
    echo ""
    podman ps -a --filter "name=$PROJECT_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

# Clean up containers and images
clean() {
    log_warning "Cleaning up containers and images..."
    
    # Stop and remove containers
    podman stop $DEV_CONTAINER $PROD_CONTAINER 2>/dev/null || true
    podman rm $DEV_CONTAINER $PROD_CONTAINER 2>/dev/null || true
    
    # Remove images
    podman rmi $DEV_IMAGE $PROD_IMAGE 2>/dev/null || true
    
    # Clean up volumes
    podman volume rm ltk-node-modules 2>/dev/null || true
    
    # Prune system
    podman system prune -f
    
    log_success "Cleanup completed"
}

# Health check
health() {
    local container=${1:-$DEV_CONTAINER}
    local port=${2:-4321}
    local protocol="http"
    
    log_info "Checking health of $container..."
    
    if ! podman ps -q -f name=$container &> /dev/null; then
        log_error "Container $container is not running"
        return 1
    fi
    
    # Wait for container to be ready
    sleep 2
    
    # Check health endpoint
    if curl -f -s "${protocol}://localhost:${port}/health" > /dev/null 2>&1; then
        log_success "Container $container is healthy"
    elif curl -f -s "${protocol}://localhost:${port}/" > /dev/null 2>&1; then
        log_success "Container $container is responding"
    else
        log_error "Container $container is not responding"
        return 1
    fi
}

# Show help
show_help() {
    cat << EOF
LTK Astro Development Script

Usage: $0 [command]

Commands:
  build-dev     Build development Docker image
  build-prod    Build production Docker image
  start-dev     Start development container (port 4321)
  start-prod    Start production container (port 8080)
  stop-dev      Stop development container
  stop-prod     Stop production container
  logs [name]   Show container logs (defaults to dev container)
  shell [name]  Open shell in container (defaults to dev container)
  status        Show status of all containers
  health [name] Check container health
  clean         Clean up all containers and images
  help          Show this help message

Examples:
  $0 build-dev && $0 start-dev    # Build and start development
  $0 logs                         # Show development container logs
  $0 shell ltk-astro-prod        # Open shell in production container
  $0 health ltk-astro-prod 8080  # Check production container health

EOF
}

# Main script logic
main() {
    check_podman
    
    case "${1:-help}" in
        build-dev)
            build_dev
            ;;
        build-prod)
            build_prod
            ;;
        start-dev)
            build_dev
            start_dev
            ;;
        start-prod)
            build_prod
            start_prod
            ;;
        stop-dev)
            stop_dev
            ;;
        stop-prod)
            stop_prod
            ;;
        logs)
            logs $2
            ;;
        shell)
            shell $2
            ;;
        status)
            status
            ;;
        health)
            health $2 $3
            ;;
        clean)
            clean
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "Unknown command: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"