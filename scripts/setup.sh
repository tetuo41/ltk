#!/bin/bash

# LTK Astro Project Setup Script
# This script sets up the development environment

set -e

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

# Print banner
print_banner() {
    cat << 'EOF'
    
 ██╗  ████████╗██╗  ██╗     █████╗ ███████╗████████╗██████╗  ██████╗ 
 ██║  ╚══██╔══╝██║ ██╔╝    ██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗
 ██║     ██║   █████╔╝     ███████║███████╗   ██║   ██████╔╝██║   ██║
 ██║     ██║   ██╔═██╗     ██╔══██║╚════██║   ██║   ██╔══██╗██║   ██║
 ███████╗██║   ██║  ██╗    ██║  ██║███████║   ██║   ██║  ██║╚██████╔╝
 ╚══════╝╚═╝   ╚═╝  ╚═╝    ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ 
                                                                        
         League The k4sen - Development Environment Setup
                    精霊の花祭り 幽明の境
EOF
    echo ""
}

# Check system requirements
check_requirements() {
    log_info "Checking system requirements..."
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        log_success "Node.js found: $NODE_VERSION"
        
        # Check if version is 18+
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR" -lt 18 ]; then
            log_error "Node.js version 18+ required, found $NODE_VERSION"
            exit 1
        fi
    else
        log_error "Node.js not found. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        log_success "npm found: $NPM_VERSION"
    else
        log_error "npm not found. Please ensure npm is installed with Node.js"
        exit 1
    fi
    
    # Check Podman (optional)
    if command -v podman &> /dev/null; then
        PODMAN_VERSION=$(podman --version)
        log_success "Podman found: $PODMAN_VERSION"
        HAS_PODMAN=true
    else
        log_warning "Podman not found. Container development will not be available."
        log_info "To install Podman, visit: https://podman.io/getting-started/installation"
        HAS_PODMAN=false
    fi
    
    # Check Docker as fallback (optional)
    if [ "$HAS_PODMAN" = false ] && command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version)
        log_success "Docker found: $DOCKER_VERSION"
        log_info "You can use Docker instead of Podman for container development"
        HAS_CONTAINER=true
    elif [ "$HAS_PODMAN" = true ]; then
        HAS_CONTAINER=true
    else
        HAS_CONTAINER=false
    fi
}

# Install dependencies
install_dependencies() {
    log_info "Installing project dependencies..."
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    log_success "Dependencies installed successfully"
}

# Setup development environment
setup_development() {
    log_info "Setting up development environment..."
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        cat > .env << EOF
# Development environment variables
NODE_ENV=development
ASTRO_HOST=0.0.0.0
ASTRO_PORT=4321
EOF
        log_success "Created .env file"
    else
        log_info ".env file already exists"
    fi
    
    # Make scripts executable
    chmod +x scripts/*.sh 2>/dev/null || true
    log_success "Made scripts executable"
}

# Run type checking
check_types() {
    log_info "Running TypeScript type checking..."
    npm run check
    log_success "Type checking passed"
}

# Test development server
test_dev_server() {
    log_info "Testing development server startup..."
    
    # Start dev server in background
    npm run dev &
    DEV_PID=$!
    
    # Wait for server to start
    sleep 5
    
    # Test if server is responding
    if curl -f -s http://localhost:4321/ > /dev/null 2>&1; then
        log_success "Development server is working correctly"
    else
        log_warning "Development server may not be fully ready yet"
    fi
    
    # Kill the dev server
    kill $DEV_PID 2>/dev/null || true
    sleep 2
}

# Test container build (if available)
test_container_build() {
    if [ "$HAS_CONTAINER" = true ]; then
        log_info "Testing container build..."
        
        local cmd="podman"
        if [ "$HAS_PODMAN" = false ]; then
            cmd="docker"
        fi
        
        # Build development image
        $cmd build -t ltk-astro:dev --target development . > /dev/null 2>&1
        log_success "Container build test passed"
        
        # Clean up test image
        $cmd rmi ltk-astro:dev > /dev/null 2>&1 || true
    else
        log_info "Skipping container build test (no container runtime available)"
    fi
}

# Show final setup information
show_setup_info() {
    log_success "Setup completed successfully!"
    echo ""
    echo "🚀 Quick Start Commands:"
    echo ""
    echo "  Development server:"
    echo "    npm run dev              # Start development server"
    echo "    npm run build            # Build for production"
    echo "    npm run preview          # Preview production build"
    echo ""
    
    if [ "$HAS_CONTAINER" = true ]; then
        echo "  Container development:"
        echo "    ./scripts/dev.sh start-dev   # Start development container"
        echo "    ./scripts/dev.sh start-prod  # Start production container"
        echo "    ./scripts/dev.sh logs        # View container logs"
        echo "    ./scripts/dev.sh help        # Show all container commands"
        echo ""
    fi
    
    echo "  Useful commands:"
    echo "    npm run check            # TypeScript type checking"
    echo "    curl http://localhost:4321   # Test development server"
    echo ""
    echo "📖 Documentation:"
    echo "    README.md                # Full documentation"
    echo "    src/types/               # TypeScript type definitions"
    echo "    src/data/                # Tournament data files"
    echo ""
    echo "🌐 Access the application:"
    echo "    Development: http://localhost:4321"
    echo "    Production:  http://localhost:8080 (container)"
    echo ""
    echo "Happy coding! 🎮⚔️"
}

# Main setup function
main() {
    print_banner
    check_requirements
    install_dependencies
    setup_development
    check_types
    test_dev_server
    test_container_build
    show_setup_info
}

# Handle script interruption
trap 'log_error "Setup interrupted"; exit 1' INT TERM

# Run main function
main "$@"