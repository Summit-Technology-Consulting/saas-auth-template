variable "secrets" {
  description = "List of secret IDs to create in GSM"
  type        = set(string)
  default = [
    "NEXTAUTH_URL",
    "NEXTAUTH_SECRET",
    "JWT_SECRET",
    "NEXT_PUBLIC_PRO_PLAN_PRICE_ID",
    "API_URL"
  ]
}

variable "secret_values" {
  type = map(string)
  default = {
    NEXTAUTH_URL                  = "https://example.com"
    NEXTAUTH_SECRET               = "super-secret"
    JWT_SECRET                    = "jwt-123"
    NEXT_PUBLIC_PRO_PLAN_PRICE_ID = "price_abc123"
    API_URL                       = "https://api.example.com"
  }
}
