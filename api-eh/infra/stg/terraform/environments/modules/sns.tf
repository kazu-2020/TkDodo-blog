resource "aws_sns_topic" "update" {
  name = "${local.env_resource_prefix}-update"
  tags = {
    Name        = "${local.env_resource_prefix}-update"
    Stack       = var.name
    Environment = terraform.workspace
  }
  application_failure_feedback_role_arn    = lookup(var.sns_logging_arn, terraform.workspace)
  application_success_feedback_role_arn    = lookup(var.sns_logging_arn, terraform.workspace)
  application_success_feedback_sample_rate = 100
  firehose_failure_feedback_role_arn       = lookup(var.sns_logging_arn, terraform.workspace)
  firehose_success_feedback_role_arn       = lookup(var.sns_logging_arn, terraform.workspace)
  firehose_success_feedback_sample_rate    = 100
  http_failure_feedback_role_arn           = lookup(var.sns_logging_arn, terraform.workspace)
  http_success_feedback_role_arn           = lookup(var.sns_logging_arn, terraform.workspace)
  http_success_feedback_sample_rate        = 100
  lambda_failure_feedback_role_arn         = lookup(var.sns_logging_arn, terraform.workspace)
  lambda_success_feedback_role_arn         = lookup(var.sns_logging_arn, terraform.workspace)
  lambda_success_feedback_sample_rate      = 100
  sqs_failure_feedback_role_arn            = lookup(var.sns_logging_arn, terraform.workspace)
  sqs_success_feedback_role_arn            = lookup(var.sns_logging_arn, terraform.workspace)
  sqs_success_feedback_sample_rate         = 100
}
