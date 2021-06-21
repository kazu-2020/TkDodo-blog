# global固有のローカル変数
locals {
   # このdevはworkspaceのdevではなくて、デプロイする環境が tomigaya-dev なのでついているde
  global_resource_prefix = "tomigaya-dev-${var.name}"
}

