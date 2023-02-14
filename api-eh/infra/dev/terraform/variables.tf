variable "name" {}
variable "region" {}

variable "backend_domain" {
  default = {
    dev        = "dev-api-eh.nr.nhk.jp"
    staging    = ""
    production = ""
  }
}

variable "frontend_domain" {
  default = {
    dev        = "dev-eh.nr.nhk.jp"
    staging    = ""
    production = ""
  }
}

variable "subnet_private_a" {
  default = {
    # tomigaya-dev-nat-a
    dev        = "subnet-0c0798cf0dedcb52b"
    staging    = ""
    production = ""
  }
}

variable "subnet_private_c" {
  default = {
    # tomigaya-dev-nat-c
    dev        = "subnet-0134f297a6631ae21"
    staging    = ""
    production = ""
  }
}

variable "subnet_private_d" {
  default = {
    # tomigaya-dev-nat-d
    dev        = "subnet-0494f14a1e59651d2"
    staging    = ""
    production = ""
  }
}

variable "subnet_public_a" {
  default = {
    # tomigaya-dev-public-a
    dev        = "subnet-012b7c80a965cf5ca"
    staging    = ""
    production = ""
  }
}

variable "subnet_public_c" {
  default = {
    # tomigaya-dev-public-c
    dev        = "subnet-0098ac4f45c332d08"
    staging    = ""
    production = ""
  }
}

variable "subnet_public_d" {
  default = {
    # tomigaya-dev-public-d
    dev        = "subnet-0d53488556df3d532"
    staging    = ""
    production = ""
  }
}

variable "app_security_group" {
  default = {
    # tomigaya-dev-internal-sg
    dev        = "sg-0aeb9fe5497f55bce"
    staging    = ""
    production = ""
  }
}

variable "lb_security_group" {
  default = {
    # tomigaya-dev-lb-sg
    dev        = "sg-0686c11971a0fafbb"
    staging    = ""
    production = ""
  }
}

variable "vpc_id" {
  default = {
    #tomigaya-dev-vpc
    dev        = "vpc-04ce451b32004288d"
    staging    = ""
    production = ""
  }
}

variable "aws_account_id" {
  default = "359601428599"
}

variable "alb_certificate_arn" {
  default = "arn:aws:acm:ap-northeast-1:359601428599:certificate/9ed5e186-6b18-45c6-a2bd-9759e56208b8"
}

variable "cf_certificate_arn" {
  default = "arn:aws:acm:us-east-1:359601428599:certificate/b52631a1-0b57-45c7-9c22-8cf75af0c46a"
}

variable "web_acl" {
  default = {
    # tomigaya-developer-acl
    "dev.id"        = "fbe6e56e-efe8-40cc-b45f-0037f83093ea"
    "staging.id"    = ""
    "production.id" = ""
  }
}

variable "elasticache" {
  default = {
    "dev.node_type"        = "cache.t4g.small"
    "staging.node_type"    = "cache.t4g.small"
    "production.node_type" = "cache.t4g.small"
  }
}

variable "cf_alb_pre_shared_key" {
  default = {
    "dev.id"        = "dev_key"
    "staging.id"    = "staging_key"
    "production.id" = "production_key"
  }
}

variable "redis_cluster_id_key" {
  default = {
    "dev.key"        = "dev"
    "staging.key"    = "stg"
    "production.key" = "prd"
  }
}

variable "resources_bucket" {
  default = {
    "dev.domain"        = ""
    "staging.domain"    = ""
    "production.domain" = ""

    "dev.origin_path"        = "dev"
    "staging.origin_path"    = "staging"
    "production.origin_path" = "production"
  }
}

# https://aws-plus.backlog.jp/view/NHK_NR_OPS-984#comment-1378227881
variable "sns_logging_arn" {
  default = {
    dev        = "arn:aws:iam::359601428599:role/tomigaya-dev-sns-logging"
    staging    = ""
    production = ""
  }
}
