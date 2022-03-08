resource "aws_cloudfront_origin_access_identity" "assets" {
  comment = "${local.env_resource_prefix}-resources"
}

resource "aws_s3_bucket" "assets" {
  bucket = "${local.env_resource_prefix}-assets"
  acl    = "private"

  versioning {
    enabled = false
  }

  # logging {
  #   target_bucket = "${lookup(var.logging_params, "${terraform.workspace}.s3_logging_bucket")}"
  #   target_prefix = "${lookup(var.logging_params, "${terraform.workspace}.s3_target_prefix")}"
  # }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

  tags = {
    Name        = "${local.env_resource_prefix}-assets"
    Stack       = var.name
    Environment = terraform.workspace
  }

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadForGetBucketObjects",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${aws_cloudfront_origin_access_identity.assets.id}"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${local.env_resource_prefix}-assets/*"
    }
  ]
}
EOF
}

resource "aws_cloudfront_distribution" "front_distribution" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${local.env_resource_prefix}-distribution"
  default_root_object = ""
  web_acl_id          = lookup(var.web_acl, "${terraform.workspace}.id")

  tags = {
    Name        = "${local.env_resource_prefix}-distribution"
    Stack       = var.name
    Environment = terraform.workspace
  }

  origin {
    domain_name = aws_alb.alb.dns_name
    origin_id   = aws_alb.alb.id

    custom_header {
      name  = "x-pre-shared-key"
      value = lookup(var.cf_alb_pre_shared_key, "${terraform.workspace}.id")
    }

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "match-viewer"
      # origin_protocol_policy = "http-only"
      origin_ssl_protocols = ["TLSv1", "TLSv1.1", "TLSv1.2"]
      origin_read_timeout = 60
    }
  }

  default_cache_behavior {
    allowed_methods  = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = aws_alb.alb.id
    compress         = true

    forwarded_values {
      query_string = true
      headers      = ["*"]

      cookies {
        forward = "all"
      }
    }

    lambda_function_association {
      event_type   = "origin-response"
      include_body = false
      lambda_arn = aws_lambda_function.add_security_headers.qualified_arn
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
  }

  #----------------------------------------------------------
  # assets設定
  origin {
    domain_name = aws_s3_bucket.assets.bucket_domain_name
    origin_id   = aws_s3_bucket.assets.id

    s3_origin_config {
      origin_access_identity = "origin-access-identity/cloudfront/${aws_cloudfront_origin_access_identity.assets.id}"
    }
  }

  # logging_config {
  #   include_cookies = false
  #   bucket          = "${lookup(var.logging_params, "${terraform.workspace}.cf_logging_bucket")}"
  #   prefix          = "${lookup(var.logging_params, "${terraform.workspace}.cf_target_prefix")}"
  # }

  ordered_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = aws_s3_bucket.assets.id
    compress         = true
    path_pattern     = "packs/*"

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
  }

  #----------------------------------------------------------
  # resources設定
  origin {
    domain_name = data.terraform_remote_state.shared_resources.outputs.resources_bucket.bucket_domain_name
    origin_id   = data.terraform_remote_state.shared_resources.outputs.resources_bucket.id

    s3_origin_config {
      origin_access_identity = "origin-access-identity/cloudfront/${data.terraform_remote_state.shared_resources.outputs.resources_bucket.origin_access_identity_id}"
    }
  }

  ordered_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = data.terraform_remote_state.shared_resources.outputs.resources_bucket.id
    path_pattern     = "static/assets/*"

    compress = true

    forwarded_values {
      query_string = false

      headers = [
        "Origin",
      ]

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 10
    default_ttl            = 10
    max_ttl                = 10
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  aliases = [
    lookup(var.domain, terraform.workspace),
  ]
  viewer_certificate {
    # cloudfront_default_certificate = true

    acm_certificate_arn      = var.cf_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2018"
  }
}
