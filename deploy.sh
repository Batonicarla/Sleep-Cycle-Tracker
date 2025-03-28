#!/usr/bin/bash

# Deployment script for Sleep Cycle Tracker

# Exit immediately if a command exits with a non-zero status
set -e

# Variables
PROJECT_DIR="/path/to/sleep-cycle-tracker"
REPO_URL="https://github.com/Batonicarla/Sleep-Cycle-Tracker"
SERVERS=("3.84.30.55" "52.90.62.59")
LOAD_BALANCER="3.87.57.141"
REMOTE_USER="ubuntu"

# Function to log messages
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"
}

# Validate deployment environment
validate_environment() {
    log "Validating deployment environment..."
    
    # Check if required tools are installed
    command -v git >/dev/null 2>&1 || { log "Git is not installed. Aborting."; exit 1; }
    command -v pip >/dev/null 2>&1 || { log "Pip is not installed. Aborting."; exit 1; }
    command -v docker >/dev/null 2>&1 || { log "Docker is not installed. Aborting."; exit 1; }
}

# Prepare the application
prepare_application() {
    log "Preparing application for deployment..."
    
    # Clone the repository (or update existing)
    if [ ! -d "$PROJECT_DIR" ]; then
        git clone "$REPO_URL" "$PROJECT_DIR"
    else
        cd "$PROJECT_DIR"
        git pull origin main
    fi
    
    # Install dependencies
    pip install -r requirements.txt
    
    # Build Docker image
    docker build -t sleep-cycle-tracker .
}

# Deploy to web servers
deploy_to_servers() {
    for server in "${SERVERS[@]}"; do
        log "Deploying to server: $server"
        
        # Copy files to remote server
        scp -r "$PROJECT_DIR" "$REMOTE_USER@$server:/home/$REMOTE_USER/sleep-cycle-tracker"
        
        # SSH into server and run deployment commands
        ssh "$REMOTE_USER@$server" << DEPLOY_COMMANDS
            cd /home/$REMOTE_USER/sleep-cycle-tracker
            docker stop sleep-cycle-tracker || true
            docker rm sleep-cycle-tracker || true
            docker build -t sleep-cycle-tracker .
            docker run -d --name sleep-cycle-tracker -p 5000:5000 sleep-cycle-tracker
DEPLOY_COMMANDS
        
        log "Deployment to $server completed"
    done
}

# Configure load balancer
configure_load_balancer() {
    log "Configuring load balancer..."
    
    ssh "$REMOTE_USER@$LOAD_BALANCER" << LOAD_BALANCER_CONFIG
        # Nginx or HAProxy configuration for load balancing
        # Example Nginx configuration
        cat > /etc/nginx/nginx.conf << EOF
events {
    worker_connections 1024;
}

http {
    upstream sleep_tracker {
        server 3.84.30.55:5000;
        server 52.90.62.59:5000;
    }

    server {
        listen 80;
        location / {
            proxy_pass http://sleep_tracker;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
        }
    }
}
EOF
        
        # Restart nginx
        systemctl restart nginx
LOAD_BALANCER_CONFIG
    
    log "Load balancer configuration completed"
}

# Main deployment function
main() {
    validate_environment
    prepare_application
    deploy_to_servers
    configure_load_balancer
    
    log "Deployment completed successfully!"
}

# Run the deployment
main
