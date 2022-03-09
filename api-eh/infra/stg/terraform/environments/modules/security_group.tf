resource "aws_security_group" "redis" {
  name   = "${local.env_resource_prefix}-redis-sg"
  vpc_id = lookup(var.vpc_id, terraform.workspace)

  ingress {
    from_port = 6379
    to_port   = 6379
    protocol  = "tcp"

    security_groups = [
      lookup(var.app_security_group, terraform.workspace)
    ]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${local.env_resource_prefix}-redis-sg"
    Stack       = var.name
    Environment = terraform.workspace
  }
}
