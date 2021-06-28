# Lambda@Edgeは現状バージニアにつくる必要があるためそれ用のProvider
# 米国東部 (バージニア北部)
provider "aws" {
  region = "us-east-1"
  alias  = "virginia"
}

data "archive_file" "add_security_headers" {
  type        = "zip"
  source_dir  = "lambda/add_security_headers"
  output_path = "lambda/dst/add_security_headers.zip"
}

resource "aws_lambda_function" "add_security_headers" {
  provider         = aws.virginia
  filename         = data.archive_file.add_security_headers.output_path
  function_name    = "${local.env_resource_prefix}-add-security-headers"
  role             = aws_iam_role.iam_lambda_edge.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.add_security_headers.output_base64sha256
  runtime          = "nodejs10.x"

  publish          = true

  memory_size = 128
  timeout     = 3

  tags = {
    Name        = "${local.env_resource_prefix}-add-security-headers"
    Stack       = var.name
    Environment = terraform.workspace
  }
}
