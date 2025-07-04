output "connection_name" {
  description = "The connection name of the Cloud SQL instance (used for Unix socket connections)"
  value       = google_sql_database_instance.postgres.connection_name
}

output "public_ip_address" {
  description = "The public IPv4 address of the Cloud SQL instance (if public IP is enabled)"
  value = (
    length(google_sql_database_instance.postgres.ip_address) > 0 ?
    google_sql_database_instance.postgres.ip_address[0].ip_address :
    null
  )
}

output "database_name" {
  description = "The name of the database created in the instance"
  value       = google_sql_database.database.name
}

output "database_user" {
  description = "The name of the database user"
  value       = google_sql_user.user.name
}

output "database_password" {
  description = "The password for the database user"
  value       = "postgres"
  sensitive   = true
}