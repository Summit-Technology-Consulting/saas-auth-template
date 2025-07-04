# SaaS Template with Authentication

A modern, production-ready SaaS application template featuring user authentication, subscription management with Stripe, and infrastructure as code with Terraform.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Stripe Integration](#stripe-integration)
  - [Terraform Infrastructure](#terraform-infrastructure)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)

## ✨ Features

- **Authentication System**: JWT-based authentication with user registration/login
- **Subscription Management**: Stripe integration for subscription billing
- **Modern Frontend**: Next.js 15 with TypeScript, Tailwind CSS, and Redux
- **FastAPI Backend**: Python FastAPI with SQLAlchemy ORM
- **Infrastructure as Code**: Terraform for GCP deployment
- **Kubernetes and Helm**: Comes with Kubernetes and Helm options
- **Containerized**: Docker Compose for local development
- **Database**: PostgreSQL with Alembic migrations
- **CI/CD**: Utilizes Github Actions for CI and CD

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd saas-webapp-template
   ```

2. **Install dependencies**
   ```bash
   # Backend dependencies
   pdm install
   
   # Frontend dependencies
   cd frontend
   pnpm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the application**
   ```bash
   make build up
   ```

5. **Visit the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## 🔧 Detailed Setup

### Backend Setup

The backend is built with FastAPI, SQLAlchemy, and PostgreSQL.

#### Dependencies
- **FastAPI**: Web framework
- **SQLAlchemy**: ORM for database operations
- **Alembic**: Database migrations
- **Stripe**: Payment processing
- **PyJWT**: JWT token handling
- **Pytest**: Testing framework

#### Installation
```bash
# Install Python dependencies
pdm install

# Run database migrations
pdm run alembic upgrade head

# Run tests
make pytest
```

#### Development Server
```bash
# Start backend with hot reload
make build up-dev
```

### Frontend Setup

The frontend is built with Next.js 15, TypeScript, and Tailwind CSS.

#### Dependencies
- **Next.js 15**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Redux Toolkit**: State management
- **NextAuth.js**: Authentication
- **Axios**: HTTP client

#### Installation
```bash
cd frontend
pnpm install
```

#### Development Server
```bash
make build up-dev
```

#### Build for Production
```bash
make build up
```

### Stripe Integration

The application includes comprehensive Stripe integration for subscription management.

#### Setup Steps

1. **Create a Stripe Account**
   - Sign up at [stripe.com](https://stripe.com)
   - Get your API keys from the dashboard

2. **Configure Environment Variables**
   ```bash
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   PRO_PLAN_PRICE_ID=price_...
   ```

3. **Create Products and Prices**
   - Create a product in Stripe Dashboard
   - Create a recurring price for your subscription
   - Copy the price ID to your environment variables

4. **Set up Webhooks**
   - Configure webhook endpoint: `https://your-domain.com/stripe/webhook`
   - Events to listen for:
     - `customer.subscription.created`
     - `invoice.payment_succeeded`
     - `customer.subscription.deleted`

### CI/CD Setup

1. **Edit `./.github/workflows/main.yml`**

    ```yml
    build:
    runs-on: ubuntu-latest
    needs: [test, version]

    strategy:
      matrix:
        include:
          - dockerfile: ./.deploy/docker-images/Dockerfile.frontend
            dockerhub_repo: your-frontend-repo
          - dockerfile: ./.deploy/docker-images/Dockerfile.backend
            dockerhub_repo: your-backend-repo
    ```

2. **Create some environment variables for the Github Repo**
    ```bash
    DOCKERHUB_USERNAME=your-dockerhub-username
    GPAT_TOKEN=your-gpat-token
    HELM_REPO_PATH=your-helm-repo-path # ex: jaypyles/helm.git
    CHART_NAME=your-chart-name # ex: saas-webapp-template
    ```

You can always comment out the push to helm part of the workflow file or delete, if you would not like to use it.

#### Features
- **Subscription Management**: Create, cancel, and reactivate subscriptions
- **Webhook Handling**: Automatic subscription status updates
- **Customer Management**: Automatic Stripe customer creation
- **Payment Processing**: Secure checkout sessions

### Terraform Infrastructure

The infrastructure is managed with Terraform and deploys to Google Cloud Platform.

#### Prerequisites
```bash
# Install Google Cloud CLI
curl https://sdk.cloud.google.com | bash
gcloud init

# Install Terraform
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs)"
sudo apt-get update && sudo apt-get install terraform
```

#### Setup Steps

1. **Configure Variables**
   Edit `.deploy/terraform/terraform.tfvars`:
   ```hcl
   project_id = "your-gcp-project-id"
   region     = "us-central1"
   frontend_image = "gcr.io/your-project/frontend:latest"
   backend_image  = "gcr.io/your-project/backend:latest"
   ```

2. **Initialize Terraform**
   ```bash
   make init-terraform
   ```

3. **Initialize GCP APIs**
   ```bash
   make init-gcp-apis project_id=your-project-id
   ```

4. **Deploy Infrastructure**
   ```bash
   # Deploy all resources
   make apply
   
   # Deploy specific resource
   make apply-resource target=module.vpc
   ```

#### Infrastructure Components
- **VPC**: Virtual Private Cloud with private subnets
- **Cloud SQL**: Managed PostgreSQL database
- **Cloud Run**: Serverless containers for frontend and backend
- **Secret Manager**: Secure environment variable storage
- **Load Balancer**: HTTPS traffic distribution

#### Useful Commands
```bash
# Refresh Terraform state
make terraform-refresh

# Destroy specific resource
make destroy-resource resource=module.vpc

# Destroy all infrastructure
make destroy
```

## 🔐 Environment Variables

### Required Variables

#### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/saas_db # could technically be any database as long as supported by sqlalchemy

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PRO_PLAN_PRICE_ID=price_...

# Application
APP_MODE=dev # dev | prod
FRONTEND_BASE_URL=http://localhost:3000
```

#### Frontend (frontend/.env)
```bash
# Authentication
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key # same as backend

# API
API_URL=http://localhost:8000
```

## 🛠️ Development

### Available Make Commands

```bash
# Docker Operations
make build          # Build Docker images
make up             # Start containers
make down           # Stop containers
make up-dev         # Start with development overrides

# Testing
make pytest         # Run backend tests

# Terraform Operations
make init-terraform # Initialize Terraform
make apply          # Deploy infrastructure
make destroy        # Destroy infrastructure
make terraform-refresh # Refresh Terraform state

# GCP Operations
make init-gcp-apis  # Initialize required GCP APIs
```

Run `make` for all available commands

### Development Workflow

1. **Start Development Environment**
   ```bash
   make up-dev
   ```

2. **Run Tests**
   ```bash
   make pytest
   ```

3. **Database Migrations**
   ```bash
   pdm run alembic revision --autogenerate -m "Description"
   pdm run alembic upgrade head
   ```

## 🚀 Deployment

1. **Deploy Infrastructure**
   ```bash
   make apply
   ```

## 📚 API Documentation

Once the backend is running, you can access:

- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

### Key API Endpoints

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

#### Stripe Integration
- `GET /stripe/create-checkout-session` - Create payment session
- `POST /stripe/cancel-subscription` - Cancel subscription
- `POST /stripe/webhook` - Stripe webhook handler

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the test files for usage examples
