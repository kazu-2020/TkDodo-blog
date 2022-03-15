# FIXME: 重要
# バケットに xx-app-resourceと xx-resourcesがあって、画像用に後者を利用している
# terrafromでは xx-app-resourcesの方を設定していた、xx-resourcesはplanで差分が出ないから管理外となっている模様
# terrafromで xx-app-の方をリネームして辻褄を合わせようとしたが、バケットのreplaceが走ってしまい、中身が消える可能性があるので手動で対応
# stg, prdでは対応済み
resource "aws_cloudfront_origin_access_identity" "resources_bucket" {
  comment = "${local.global_resource_prefix}-app-resources-bucket"
}

resource "aws_s3_bucket" "resources_bucket" {
  bucket = "${local.global_resource_prefix}-app-resources"
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
      "Resource": "arn:aws:s3:::${local.global_resource_prefix}-app-resources/*"
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
