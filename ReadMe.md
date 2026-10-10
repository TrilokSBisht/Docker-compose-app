# 🐳 Docker Compose Full-Stack Application

A modern full-stack application built with React, Node.js, Express, and PostgreSQL, all containerized with Docker Compose.

## 🚀 Quick Start

### Prerequisites & Installation

1. **Install Docker Desktop**
   
   Visit the official Docker documentation and download Docker Desktop for your operating system:
   - 📖 **Official Docker Docs**: https://docs.docker.com/
   - 💻 **Download Docker Desktop**: https://docs.docker.com/desktop/

   **Installation Steps:**
   - **Windows**: Download Docker Desktop for Windows and follow the installer
   - **macOS**: Download Docker Desktop for Mac and drag to Applications folder
   - **Linux**: Follow the Docker Engine installation guide for your distribution

2. **Verify Docker Installation**
   ```bash
   docker --version
   docker compose --version
   ```

### 🔥 Clone and Run

1. **Clone the Repository**
   ```bash
   git clone <your-repository-url>
   cd docker-compose
   ```

2. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your preferred database credentials
   ```

3. **Build and Run with Docker Compose**
   ```bash
   docker compose up --build
   ```

4. **Access the Application**
   - 🌐 **Frontend**: http://localhost:3000
   - 🔧 **Backend API**: http://localhost:5001
   - 📊 **Database**: localhost:5432

## 📁 Project Structure

```
docker-compose/
├── Frontend/                 # React application
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   └── App.css          # Modern styling
│   ├── Dockerfile           # Frontend container config
│   └── package.json         # Frontend dependencies
├── Backend/                 # Node.js/Express API
│   ├── index.js            # Main server file
│   ├── Dockerfile          # Backend container config
│   └── package.json        # Backend dependencies
├── docker-compose.yml      # Multi-container orchestration
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🛠 Application Features

- **Modern React Frontend** with gradient design and responsive layout
- **Express.js REST API** with CORS enabled
- **PostgreSQL Database** with automatic table initialization
- **Real-time Database Connectivity** displaying current timestamp
- **Data Persistence** with Docker volumes
- **Health Checks** ensuring services start in correct order
- **Custom Docker Network** for service communication

## 📚 Docker Compose Commands

```bash
# Start all services
docker compose up

# Start with rebuild
docker compose up --build

# Start in background (detached mode)
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs

# View logs for specific service
docker compose logs backend

# Execute commands in running container
docker compose exec backend bash
docker compose exec database psql -U postgres -d postgres

# Remove everything including volumes
docker compose down --volumes
```

---

## 📖 Comprehensive Docker Documentation

### What is Docker? 🐳

Docker is a containerization platform that allows you to package applications and their dependencies into lightweight, portable containers. Think of containers as lightweight virtual machines that contain everything needed to run an application.

**Key Benefits:**
- **Consistency**: "It works on my machine" → "It works everywhere"
- **Isolation**: Applications run in isolated environments
- **Portability**: Run anywhere Docker is installed
- **Efficiency**: Lightweight compared to traditional VMs
- **Scalability**: Easy to scale applications horizontally

### Docker Images vs Containers

#### 🖼 Docker Images
- **Definition**: Read-only templates used to create containers
- **Think of it as**: A blueprint or snapshot of an application
- **Contains**: Application code, runtime, libraries, environment variables, config files

```bash
# List all images
docker images

# Pull an image from Docker Hub
docker pull postgres:17-alpine

# Build an image from Dockerfile
docker build -t my-app .

# Remove an image
docker rmi image-name
```

#### 📦 Containers
- **Definition**: Running instances of Docker images
- **Think of it as**: An actual running application based on the image
- **Lifecycle**: Created → Started → Running → Stopped → Removed

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Run a container
docker run -d --name my-container my-image

# Stop a container
docker stop container-name

# Remove a container
docker rm container-name

# Execute command in running container
docker exec -it container-name bash
```

### Essential Docker Commands

#### Image Management
```bash
# Build image from Dockerfile
docker build -t app-name:tag .

# Pull image from registry
docker pull ubuntu:latest

# Push image to registry
docker push username/app-name:tag

# View image history
docker history image-name

# Remove unused images
docker image prune
```

#### Container Management
```bash
# Run container with port mapping
docker run -p 3000:80 nginx

# Run container with environment variables
docker run -e NODE_ENV=production my-app

# Run container with volume mount
docker run -v /host/path:/container/path my-app

# View container logs
docker logs container-name

# Follow container logs in real-time
docker logs -f container-name
```

#### System Management
```bash
# View Docker system information
docker system info

# Clean up unused resources
docker system prune

# View disk usage
docker system df

# Remove all stopped containers
docker container prune
```

### Containerizing Applications

#### Creating a Dockerfile

**Frontend Dockerfile Example:**
```dockerfile
# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Use nginx to serve built files
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

**Backend Dockerfile Example:**
```dockerfile
# Use official Node.js runtime
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose application port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
```

### Docker Networking 🌐

Docker creates isolated networks for containers to communicate securely.

#### Network Types

1. **Bridge Network** (Default)
   - Containers can communicate with each other
   - Isolated from host network
   
2. **Host Network**
   - Container shares host's network
   - Better performance but less isolation

3. **None Network**
   - No network access
   - Maximum isolation

#### Network Commands
```bash
# List networks
docker network ls

# Create custom network
docker network create my-network

# Connect container to network
docker network connect my-network container-name

# Inspect network details
docker network inspect my-network

# Remove network
docker network rm my-network
```

#### Service Communication
In Docker Compose, services communicate using service names:
```yaml
services:
  backend:
    # ...
    environment:
      DB_HOST: database  # 'database' is the service name
  
  database:
    # PostgreSQL service
```

### Multi-Stage Docker Builds 🏗

Multi-stage builds optimize image size and security by using multiple `FROM` statements.

#### Benefits of Multi-Stage Builds

1. **Smaller Production Images**: Remove build tools and dependencies
2. **Better Security**: Fewer attack vectors in final image
3. **Faster Deployments**: Smaller images transfer faster
4. **Clean Separation**: Build and runtime environments separated

#### Multi-Stage Example

```dockerfile
# Stage 1: Build Environment
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production Environment
FROM nginx:alpine AS production

# Copy only built files from previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config if needed
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Multi-Stage Commands
```bash
# Build specific stage
docker build --target builder -t my-app:build .

# Build final production stage
docker build -t my-app:prod .

# Build with build arguments
docker build --build-arg NODE_ENV=production -t my-app .
```

### Docker Compose 🎼

Docker Compose is a tool for defining and running multi-container Docker applications using YAML files.

#### Why Docker Compose?

- **Multi-Container Management**: Orchestrate multiple services
- **Environment Consistency**: Same setup across development/staging/production
- **Simple Commands**: Start entire stack with one command
- **Service Dependencies**: Define startup order and dependencies
- **Network Isolation**: Automatic network creation for services
- **Volume Management**: Persistent data storage

#### Docker Compose File Structure

```yaml
version: '3.8'  # Optional in newer versions

services:
  # Frontend Service
  frontend:
    build: ./Frontend              # Build from local Dockerfile
    ports:
      - "3000:80"                 # Host:Container port mapping
    depends_on:                   # Service dependencies
      - backend
    networks:
      - app-network
    environment:                  # Environment variables
      - NODE_ENV=production
    volumes:                      # Volume mounts
      - ./logs:/app/logs

  # Backend Service
  backend:
    build: ./Backend
    ports:
      - "5001:5000"
    environment:
      DB_HOST: database           # Service name as hostname
      DB_USER: ${POSTGRES_USER}   # Environment variable from .env
    depends_on:
      database:
        condition: service_healthy # Wait for health check
    networks:
      - app-network

  # Database Service
  database:
    image: postgres:17-alpine     # Use pre-built image
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data  # Named volume
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql  # Bind mount
    healthcheck:                  # Health check configuration
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - app-network

# Named volumes for data persistence
volumes:
  postgres_data:

# Custom networks for service isolation
networks:
  app-network:
    driver: bridge
```

#### Essential Docker Compose Commands

```bash
# Development Commands
docker compose up                 # Start all services
docker compose up -d             # Start in detached mode
docker compose up --build        # Rebuild images before starting
docker compose up service-name   # Start specific service

# Management Commands
docker compose down              # Stop and remove containers
docker compose down --volumes    # Also remove volumes
docker compose restart          # Restart all services
docker compose restart backend  # Restart specific service

# Monitoring Commands
docker compose logs             # View logs from all services
docker compose logs -f backend # Follow logs from backend service
docker compose ps              # List running services
docker compose top             # Display running processes

# Maintenance Commands
docker compose pull            # Pull latest images
docker compose build          # Build/rebuild services
docker compose build --no-cache # Build without using cache

# Execution Commands
docker compose exec backend bash        # Execute command in service
docker compose exec database psql -U postgres # Connect to database
docker compose run backend npm test     # Run one-off command
```

#### Environment Variables in Compose

Create a `.env` file in the same directory as `docker-compose.yml`:

```env
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secure_password
POSTGRES_DB=myapp

# Application Configuration
NODE_ENV=production
PORT=5000
```

#### Production Best Practices

1. **Use Specific Image Tags**
   ```yaml
   image: postgres:17-alpine  # Not 'latest'
   ```

2. **Implement Health Checks**
   ```yaml
   healthcheck:
     test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
     interval: 30s
     timeout: 10s
     retries: 3
   ```

3. **Use Named Volumes for Data**
   ```yaml
   volumes:
     - postgres_data:/var/lib/postgresql/data
   ```

4. **Implement Resource Limits**
   ```yaml
   deploy:
     resources:
       limits:
         memory: 512M
         cpus: '0.5'
   ```

5. **Use Multi-Stage Builds**
   ```dockerfile
   FROM node:18-alpine AS builder
   # Build stage...
   
   FROM node:18-alpine AS production
   # Production stage...
   ```

## 🔧 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Kill process using port 3000
sudo lsof -ti:3000 | xargs kill -9
```

**Database Connection Issues:**
```bash
# Check if database is healthy
docker compose ps
# View database logs
docker compose logs database
```

**Build Cache Issues:**
```bash
# Build without cache
docker compose build --no-cache
```

**Permission Issues (Linux):**
```bash
# Add user to docker group
sudo usermod -aG docker $USER
# Logout and login again
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues or have questions, please open an issue in the GitHub repository.
## AWS Deployment — ECR and ECS Fargate

### Project Overview

This project is a full-stack web application built using React, Node.js, Express, and PostgreSQL. The application was containerized using Docker and deployed on AWS using Amazon ECR and Amazon ECS with AWS Fargate.

### AWS Services Used

* **Amazon ECR:** Stores the Docker images for the frontend and backend.
* **Amazon ECS:** Manages and runs the application containers.
* **AWS Fargate:** Runs containers without requiring us to manage EC2 worker servers.
* **Amazon VPC:** Provides networking for communication between services.
* **Amazon CloudWatch Logs:** Collects container logs for troubleshooting.

### Deployment Architecture

1. The React frontend is served through Nginx.
2. The frontend sends HTTP requests to the Express backend.
3. The backend communicates with the PostgreSQL database.
4. Docker images are stored in Amazon ECR.
5. Amazon ECS runs the frontend, backend, and database as separate services using Fargate.

### ECR Image Tags

* Frontend: `frontend-v2`
* Backend: `backend-v1`

### ECS Services

* `first-frontend-service`
* `first-backend-service`
* `first-database-service`

### Testing and Verification

* Verified that the frontend website was accessible.
* Verified that the backend database endpoint returned a timestamp.
* Verified successful data insertion through the frontend.
* Updated the frontend image, pushed it to ECR, and deployed the new `first-frontend:2` task definition revision.

### Challenges and Solutions

* **Frontend connection failure:** Replaced the incorrect `localhost` API address with the backend's public IP and port.
* **Database connectivity:** Configured the backend to connect to the database through AWS ECS service discovery.
* **Image deployment:** Built a new frontend image, pushed it to ECR, and updated the ECS service with a new task definition revision.

### Learning Outcomes

This project provided practical experience with Docker image creation, Amazon ECR, ECS task definitions, Fargate services, service discovery, environment variables, application networking, deployment troubleshooting, and application verification.
