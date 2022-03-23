# 環境別固有のローカル変数
locals {
  env_resource_prefix = "tomigaya-${lookup(var.env_key, "${terraform.workspace}")}-${var.name}"
}
