resource "aws_iam_role" "iam_role" {
  assume_role_policy = file("${path.module}/ecs_assume_role_policy.json")
  name               = "${local.env_resource_prefix}_ecs"

  tags = {
    Name        = "${local.env_resource_prefix}_ecs"
    Stack       = var.name
    Environment = terraform.workspace
  }
}

# アプリケーション用のロール
resource "aws_iam_role" "iam_role_app" {
  assume_role_policy = file("${path.module}/ecs_assume_role_policy.json")
  name               = "${local.env_resource_prefix}-app-role"

  tags = {
    Name        = "${local.env_resource_prefix}-app-role"
    Stack       = var.name
    Environment = terraform.workspace
  }
}

# アプリケーション用ロールのポリシー
resource "aws_iam_role_policy" "app_role_policy" {
  name   = "${local.env_resource_prefix}-app-role-policy"
  role   = aws_iam_role.iam_role_app.name
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "s3:*"
            ],
            "Resource": [
                "arn:aws:s3:::${aws_s3_bucket.assets.bucket}/*",
                "arn:aws:s3:::${data.terraform_remote_state.shared_resources.outputs.resources_bucket.bucket}/*",
                "arn:aws:s3:::${data.terraform_remote_state.shared_resources.outputs.resources_bucket.bucket}"
            ]
        }
    ]
}
EOF
}

# スケジュールタスク用のロール
resource "aws_iam_role" "iam_role_event" {
  assume_role_policy = file("${path.module}/ecs_assume_role_policy_for_event.json")
  name               = "${local.env_resource_prefix}_ecs_event"

  tags = {
    Name        = "${local.env_resource_prefix}_ecs_event"
    Stack       = var.name
    Environment = terraform.workspace
  }
}

resource "aws_iam_role_policy_attachment" "ecs_event" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceEventsRole"
  role       = aws_iam_role.iam_role_event.id
}

resource "aws_iam_role_policy" "ecs_event_inline_policy" {
  name   = "${local.env_resource_prefix}-ssm-prameter-store-policy"
  role   = aws_iam_role.iam_role_event.name
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "iam:GetRole",
                "iam:PassRole"
            ],
            "Resource": [
                "${aws_iam_role.iam_role.arn}"
            ]
        }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "ecs_service" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceRole"
  role       = aws_iam_role.iam_role.id
}

resource "aws_iam_role_policy_attachment" "ecr" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
  role       = aws_iam_role.iam_role.id
}

resource "aws_iam_role_policy_attachment" "ecr_power_user" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser"
  role       = aws_iam_role.iam_role.id
}

resource "aws_iam_role_policy" "ssm_policy" {
  name   = "${local.env_resource_prefix}-ssm-prameter-store-policy"
  role   = aws_iam_role.iam_role.name
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameters"
      ],
      "Resource": [
        "arn:aws:ssm:ap-northeast-1:${var.aws_account_id}:parameter/*"
      ]
    }
  ]
}
EOF
}

# Lamda@Edge用のロール
resource "aws_iam_role" "iam_lambda_edge" {
  name               = "${local.env_resource_prefix}_lambda_edge"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": ["lambda.amazonaws.com", "edgelambda.amazonaws.com"]
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_edge_service" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.iam_lambda_edge.id
}

