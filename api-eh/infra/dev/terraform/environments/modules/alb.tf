resource "aws_alb" "alb" {
  name = "${local.env_resource_prefix}-lb"
  security_groups = [
    "${lookup(var.lb_security_group, "${terraform.workspace}")}"
  ]

  subnets = [
    "${lookup(var.subnet_public_a, "${terraform.workspace}")}",
    "${lookup(var.subnet_public_c, "${terraform.workspace}")}"
    #    "${lookup(var.subnet_public_d, "${terraform.workspace}")}"
  ]

  internal                   = false
  enable_deletion_protection = false

  idle_timeout = 120

  tags = {
    Name        = "${local.env_resource_prefix}-lb"
    Stack       = "${var.name}"
    Environment = "${terraform.workspace}"
  }
  # access_logs {
  #   bucket = "${var.bucket}"
  # }
}

resource "aws_alb_target_group" "alb" {
  name        = "${local.env_resource_prefix}-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = "${lookup(var.vpc_id, "${terraform.workspace}")}"
  target_type = "ip"

  # ALBがインスタンスを登録解除する前に待つ時間(デフォルトは300秒なので長い)
  deregistration_delay = 30

  health_check {
    interval            = 60
    path                = "/healthcheck"
    protocol            = "HTTP"
    timeout             = 20
    unhealthy_threshold = 4
    matcher             = 200
  }

  tags = {
    Name        = "${local.env_resource_prefix}-tg"
    Stack       = "${var.name}"
    Environment = "${terraform.workspace}"
  }
}

resource "aws_alb_listener" "alb_443" {
  load_balancer_arn = "${aws_alb.alb.arn}"
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2015-05"
  certificate_arn   = "${var.alb_certificate_arn}"

  default_action {
    target_group_arn = "${aws_alb_target_group.alb.arn}"
    type             = "forward"
  }
}

resource "aws_alb_listener" "alb" {
  load_balancer_arn = "${aws_alb.alb.arn}"
  port              = "80"
  protocol          = "HTTP"

  default_action {
    target_group_arn = "${aws_alb_target_group.alb.arn}"
    type             = "forward"
  }
}
