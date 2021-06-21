output "load_balancer" {
  value = "${module.app.load_balancer}"
}

output "cloudfront" {
  value = "${module.app.cloudfront}"
}
