resource "aws_sns_topic" "update" {
  name = "${local.env_resource_prefix}-update"
  tags = {
    Name        = "${local.env_resource_prefix}-update"
    Stack       = var.name
    Environment = terraform.workspace
  }
}
