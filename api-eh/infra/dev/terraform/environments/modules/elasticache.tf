resource "aws_elasticache_subnet_group" "redis-subnet" {
  name = "${local.env_resource_prefix}-redis-subnet"
  subnet_ids = [
    lookup(var.subnet_private_a, terraform.workspace),
    lookup(var.subnet_private_c, terraform.workspace),
  ]
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "${var.name}-${lookup(var.redis_cluster_id_key, "${terraform.workspace}.key")}"
  engine               = "redis"
  node_type            = lookup(var.elasticache, "${terraform.workspace}.node_type")
  num_cache_nodes      = 1
  parameter_group_name = "${local.env_resource_prefix}-redis-params"
  engine_version       = "6.x"
  port                 = 6379
  subnet_group_name    = "${local.env_resource_prefix}-redis-subnet"
  security_group_ids = [
    aws_security_group.redis.id
  ]

  tags = {
    Name        = "${var.name}-${lookup(var.redis_cluster_id_key, "${terraform.workspace}.key")}"
    Stack       = var.name
    Environment = terraform.workspace
  }
}

resource "aws_elasticache_parameter_group" "default" {
  name   = "${local.env_resource_prefix}-redis-params"
  family = "redis6.x"

  parameter {
    # sidekiq推奨のパラメータ https://github.com/mperham/sidekiq/wiki/Using-Redis#memory
    name  = "maxmemory-policy"
    value = "noeviction"
  }
}
