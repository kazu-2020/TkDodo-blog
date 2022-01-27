resource "aws_elasticache_subnet_group" "redis-subnet" {
  name = "${local.env_resource_prefix}-redis-subnet"
  subnet_ids = [
    "${lookup(var.subnet_private_a, "${terraform.workspace}")}",
    "${lookup(var.subnet_private_c, "${terraform.workspace}")}",
    # "${lookup(var.subnet_private_d, "${terraform.workspace}")}"
  ]
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "${var.name}-${lookup(var.redis_cluster_id_key, "${terraform.workspace}.key")}"
  engine               = "redis"
  node_type            = "${lookup(var.elasticache, "${terraform.workspace}.node_type")}"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis6.x"
  engine_version       = "6.2"
  port                 = 6379
  subnet_group_name    = "${local.env_resource_prefix}-redis-subnet"
  security_group_ids = [
    "${aws_security_group.redis.id}"
  ]

  tags = {
    Name        = "${var.name}-${lookup(var.redis_cluster_id_key, "${terraform.workspace}.key")}"
    Stack       = "${var.name}"
    Environment = "${terraform.workspace}"
  }
}
