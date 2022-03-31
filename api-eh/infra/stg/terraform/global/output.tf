output "resources_bucket" {
  value = module.app.s3_resources_bucket
}

output "images_bucket" {
  value = module.app.s3_images_bucket
}

output "hosting_bucket" {
  value = module.app.s3_hosting_bucket
}
