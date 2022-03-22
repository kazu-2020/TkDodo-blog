# FIXME: 重要
# バケットに xx-app-resourceと xx-resourcesがあって、画像用に後者を利用している
# terrafromでは xx-app-resourcesの方を設定していた、xx-resourcesはplanで差分が出ないから管理外となっている模様
# terrafromで xx-app-の方をリネームして辻褄を合わせようとしたが、バケットのreplaceが走ってしまい、中身が消える可能性があるので手動で対応
# stg, prdでは対応済み
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
