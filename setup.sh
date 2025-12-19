#!/bin/bash

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🚀 Task Manager Demo - Setup${NC}"
echo ""

# Start containers
echo -e "${GREEN}▶ Starting Docker containers...${NC}"
docker compose up -d

# Wait for database to be ready
echo -e "${GREEN}▶ Waiting for database...${NC}"
until docker compose exec -T database mysqladmin ping -h"localhost" -u"demo" -p"demo" --silent 2>/dev/null; do
    sleep 2
done

# Install backend dependencies
echo -e "${GREEN}▶ Installing backend dependencies...${NC}"
docker compose exec -T backend composer install --no-interaction

# Run migrations
echo -e "${GREEN}▶ Running database migrations...${NC}"
docker compose exec -T backend php bin/console doctrine:migrations:migrate --no-interaction

# Install frontend dependencies
echo -e "${GREEN}▶ Installing frontend dependencies...${NC}"
docker compose exec -T frontend npm install

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Access:"
echo "  Frontend: http://localhost:4173"
echo "  Backend:  http://localhost:9080/api"
echo ""
echo "Useful commands:"
echo "  docker compose logs -f    # View logs"
echo "  docker compose down       # Stop containers"
echo ""
