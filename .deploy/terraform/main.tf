locals {
  secrets = [
    "NEXTAUTH_URL",
    "NEXTAUTH_SECRET",
    "JWT_SECRET",
    "PRO_PLAN_PRICE_ID",
    "API_URL",
    "APP_MODE",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "FRONTEND_BASE_URL",
    "DATABASE_URL"
  ]

  frontend_secret_values = {
    NEXTAUTH_URL    = "NEXTAUTH_URL"
    NEXTAUTH_SECRET = "NEXTAUTH_SECRET"
    API_URL         = "API_URL"
  }

  backend_secret_values = {
    APP_MODE              = "APP_MODE"
    STRIPE_SECRET_KEY     = "STRIPE_SECRET_KEY"
    STRIPE_WEBHOOK_SECRET = "STRIPE_WEBHOOK_SECRET",
    FRONTEND_BASE_URL     = "FRONTEND_BASE_URL",
    PRO_PLAN_PRICE_ID     = "PRO_PLAN_PRICE_ID",
  }

  shared_secret_values = {
    JWT_SECRET = "JWT_SECRET"
  }
}

module "vpc" {
  source = "./modules/vpc"
}

module "cloud_sql" {
  source     = "./modules/cloud_sql"
  region     = var.region
  vpc_id     = module.vpc.vpc_id
  depends_on = [module.vpc]
}

module "secret_manager" {
  source        = "./modules/secret_manager"
  secrets       = local.secrets
  secret_values = merge(local.shared_secret_values, local.frontend_secret_values, local.backend_secret_values)
  depends_on    = [module.cloud_sql]
}

module "cloud_run" {
  source           = "./modules/cloud_run"
  project_id       = var.project_id
  region           = var.region
  frontend_image   = var.frontend_image
  backend_image    = var.backend_image
  frontend_secrets = merge(local.shared_secret_values, local.frontend_secret_values)
  backend_secrets  = merge(local.shared_secret_values, local.backend_secret_values)
  database_url     = "postgresql+psycopg2://${module.cloud_sql.database_user}:${module.cloud_sql.database_password}@/${module.cloud_sql.database_name}?host=/cloudsql/${module.cloud_sql.connection_name}"
  vpc_connector    = module.vpc.connector_id
  depends_on       = [module.secret_manager, module.vpc, module.cloud_sql]
}
