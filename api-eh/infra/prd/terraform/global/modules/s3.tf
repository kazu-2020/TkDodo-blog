# ----------------------------------------
# 画像の非公開バケット（全部入り）
resource "aws_cloudfront_origin_access_identity" "resources_bucket" {
  comment = "${local.global_resource_prefix}-resources-bucket"
}

resource "aws_s3_bucket" "resources_bucket" {
  bucket = "${local.global_resource_prefix}-resources"
  acl    = "private"

  versioning {
    enabled = true
  }

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadForGetBucketObjects",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${aws_cloudfront_origin_access_identity.resources_bucket.id}"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${local.global_resource_prefix}-resources/*"
    }
  ]
}
EOF
}

resource "aws_s3_bucket_public_access_block" "resources_bucket" {
  bucket = aws_s3_bucket.resources_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ----------------------------------------
# 画像の公開バケット
resource "aws_s3_bucket" "images_bucket" {
  bucket = "${local.global_resource_prefix}-images"
  acl    = "private"

  versioning {
    enabled = true
  }

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
  # FIXME: 許可するIAMユーザーを設定する
  #  policy = <<EOF
  #{
  #    "Version": "2012-10-17",
  #    "Statement": [
  #        {
  #            "Sid": "VisualEditor0",
  #            "Effect": "Allow",
  #            "Action": "s3:GetObject",
  #            "Principal": {
  #                "AWS": "arn:aws:iam::AccountA-ID:user/Dave"
  #            },
  #            "Resource": "arn:aws:s3:::${local.global_resource_prefix}-images/*"
  #        }
  #    ]
  #}
  #EOF
}

resource "aws_s3_bucket_public_access_block" "images_bucket" {
  bucket = aws_s3_bucket.images_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ----------------------------------------
# frontend appのホスティング用バケット
resource "aws_cloudfront_origin_access_identity" "hosting_bucket" {
  comment = "${local.global_resource_prefix}-hosting-bucket"
}

resource "aws_s3_bucket" "hosting_bucket" {
  bucket                      = "${local.global_resource_prefix}-hosting"
  request_payer               = "BucketOwner"

  versioning {
    enabled    = true
    mfa_delete = false
  }
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Id": "MyPolicy",
    "Statement": [
        {
            "Sid": "HostingReadForGetBucketObjects",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${aws_cloudfront_origin_access_identity.hosting_bucket.id}"
            },
            "Action": [
                "s3:GetObject",
                "s3:listBucket"
            ],
            "Resource": [
                "arn:aws:s3:::${local.global_resource_prefix}-hosting/*",
                "arn:aws:s3:::${local.global_resource_prefix}-hosting"
            ]
        }
    ]
}
EOF
}

resource "aws_s3_bucket_public_access_block" "hosting_bucket" {
  bucket = aws_s3_bucket.hosting_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_cloudfront_origin_access_identity" "hosting_log_bucket" {
  comment = "${local.global_resource_prefix}-hosting-log-bucket"
}

resource "aws_s3_bucket" "hosting_log_bucket" {
  bucket                      = "${local.global_resource_prefix}-hosting-log"
  request_payer               = "BucketOwner"

  versioning {
    enabled    = true
    mfa_delete = false
  }
}

resource "aws_s3_bucket_public_access_block" "hosting_log_bucket" {
  bucket = aws_s3_bucket.hosting_log_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
