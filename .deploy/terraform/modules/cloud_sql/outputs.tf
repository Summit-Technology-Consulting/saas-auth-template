output "connection_name" {
  description = "The connection name of the Cloud SQL instance (used for Unix socket connections)"
  value       = google_sql_database_instance.postgres.connection_name
}

output "private_ip_address" {
  description = "The private IPv4 address of the Cloud SQL instance"
  value = (
    length([
      for ip in google_sql_database_instance.postgres.ip_address : ip
      if ip.type == "PRIVATE"
    ]) > 0 ?
    [
      for ip in google_sql_database_instance.postgres.ip_address : ip.ip_address
      if ip.type == "PRIVATE"
    ][0] :
    null
  )
  sensitive = true
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
