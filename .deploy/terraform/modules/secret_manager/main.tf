resource "google_secret_manager_secret" "secrets" {
  for_each = var.secrets

  secret_id = each.value
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "versions" {
  for_each = var.secret_values

  secret      = google_secret_manager_secret.secrets[each.key].id
  secret_data = each.value
}
