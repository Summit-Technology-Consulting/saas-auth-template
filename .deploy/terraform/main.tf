locals {
  secrets = [
    "NEXTAUTH_URL",
    "NEXTAUTH_SECRET",
    "JWT_SECRET",
    "NEXT_PUBLIC_PRO_PLAN_PRICE_ID",
    "API_URL",
    "APP_MODE",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET"
  ]

  frontend_secret_values = {
    NEXTAUTH_URL                  = "NEXTAUTH_URL"
    NEXTAUTH_SECRET               = "NEXTAUTH_SECRET"
    JWT_SECRET                    = "JWT_SECRET"
    NEXT_PUBLIC_PRO_PLAN_PRICE_ID = "NEXT_PUBLIC_PRO_PLAN_PRICE_ID"
    API_URL                       = "API_URL"
  }

  backend_secret_values = {
    APP_MODE              = "APP_MODE"
    STRIPE_SECRET_KEY     = "STRIPE_SECRET_KEY"
    STRIPE_WEBHOOK_SECRET = "STRIPE_WEBHOOK_SECRET"
  }
}

module "secret_manager" {
  source        = "./modules/secret_manager"
  secrets       = local.secrets
  secret_values = merge(local.frontend_secret_values, local.backend_secret_values)
}

module "cloud_run" {
  source           = "./modules/cloud_run"
  project_id       = var.project_id
  region           = var.region
  frontend_image   = var.frontend_image
  backend_image    = var.backend_image
  frontend_secrets = local.frontend_secret_values
  backend_secrets  = local.backend_secret_values
  depends_on       = [module.secret_manager]
}
