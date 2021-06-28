output "load_balancer" {
  value = {
    dns_name         = "${aws_alb.alb.dns_name}"
    arn              = "${aws_alb.alb.arn}"
    target_group_arn = "${aws_alb_target_group.alb.arn}"
  }
}

output "cloudfront" {
  value = {
    domain_name = "${aws_cloudfront_distribution.front_distribution.domain_name}"
  }
}
