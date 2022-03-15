output "s3_resources_bucket" {
  value = {
    id = aws_s3_bucket.resources_bucket.id
    bucket_domain_name = aws_s3_bucket.resources_bucket.bucket_domain_name
    origin_access_identity_id = aws_cloudfront_origin_access_identity.resources_bucket.id
    bucket = aws_s3_bucket.resources_bucket.bucket
  }
}

output "s3_hosting_bucket" {
  value = {
    id = aws_s3_bucket.hosting_bucket.id
    bucket_domain_name = aws_s3_bucket.hosting_bucket.bucket_domain_name
    origin_access_identity_id = aws_cloudfront_origin_access_identity.hosting_bucket.id
    bucket = aws_s3_bucket.hosting_bucket.bucket
  }
}
