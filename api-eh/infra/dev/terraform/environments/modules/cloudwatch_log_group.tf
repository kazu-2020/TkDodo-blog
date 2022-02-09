resource "aws_cloudwatch_log_group" "log_group" {
  name              = "${local.env_resource_prefix}-lg"
  retention_in_days = "365"

  tags = {
    Name        = "${local.env_resource_prefix}-lg"
    Stack       = var.name
    Environment = terraform.workspace
  }
}
