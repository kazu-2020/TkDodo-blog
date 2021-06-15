# 環境別固有のローカル変数
locals {
  env_resource_prefix = "tomigaya-${terraform.workspace}-${var.name}"
}

