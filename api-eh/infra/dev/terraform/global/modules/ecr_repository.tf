resource "aws_ecr_repository" "app_repo" {
  name  = "${var.name}-app"
  image_tag_mutability = "IMMUTABLE"
}

resource "aws_ecr_lifecycle_policy" "policy" {
  repository = aws_ecr_repository.app_repo.name
  policy     = file("${path.module}/aws_ecr_lifecycle_policy.json")
}
