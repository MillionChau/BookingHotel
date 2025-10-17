#!/bin/bash

echo "Starting Booking Hotel App in Production Mode..."

# Check if docker and docker-compose are installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Load environment variables
export $(cat .env.production | xargs)

# Build and start services
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

echo "Application is starting..."
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5360"
echo "Application will restart automatically unless stopped."