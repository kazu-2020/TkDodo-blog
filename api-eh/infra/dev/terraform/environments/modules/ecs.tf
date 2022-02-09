resource "aws_ecs_cluster" "ecs_cluster" {
  name = "${local.env_resource_prefix}-ecs-cluster"

  tags = {
    Name        = "${local.env_resource_prefix}-ecs-cluster"
    Stack       = var.name
    Environment = terraform.workspace
  }
}

resource "aws_ecs_service" "ecs" {
  name            = "${local.env_resource_prefix}-service"
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = "${local.env_resource_prefix}:1"
  # サービス作成時は必要数0にしておいて、デプロイのときに初めて必要数を設定する
  desired_count                      = 0
  launch_type                        = "FARGATE"
  platform_version                   = "1.4.0"
  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200

  network_configuration {
    subnets = [
      lookup(var.subnet_private_a, terraform.workspace),
      lookup(var.subnet_private_c, terraform.workspace),
    ]

    security_groups = [
      lookup(var.app_security_group, terraform.workspace),
    ]

    assign_public_ip = "true"
  }

  health_check_grace_period_seconds = 180

  load_balancer {
    target_group_arn = aws_alb_target_group.alb.id
    container_name   = "rails"
    container_port   = 3000
  }

  # scheduling_strategy = "REPLICA"
  # deployment_controller {
  #   type = "CODE_DEPLOY"
  # }
  # propagate_tags = "TASK_DEFINITION"

  # deployやautoscaleで動的に変化する値を差分だしたくないので無視する
  lifecycle {
    ignore_changes = [
      desired_count,
      task_definition,
      load_balancer,
    ]
  }

  # なぜかタグを設定するとエラーになるのでコメント
  # tags = {
  #   Name        = "${local.env_resource_prefix}-service"
  #   Stack       = "${var.name}"
  #   Environment = "${terraform.workspace}"
  # }
}
