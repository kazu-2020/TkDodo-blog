variable "name" {}
variable "region" {}

variable "backend_domain" {
  default = {
    production = "api-eh.nr.nhk.jp"
  }
}

variable "frontend_domain" {
  default = {
    production = "eh.nr.nhk.jp"
  }
}

variable "subnet_private_a" {
  default = {
    # tomigaya-prd-nat-a
    production = "subnet-07ab18034aa68222c"
  }
}

variable "subnet_private_c" {
  default = {
    # tomigaya-prd-nat-c
    production = "subnet-0273743cab7874534"
  }
}

variable "subnet_private_d" {
  default = {
    # tomigaya-prd-nat-d
    production = "subnet-0ad502fbc3b836d41"
  }
}

variable "subnet_public_a" {
  default = {
    # tomigaya-prd-public-a
    production = "subnet-0e38dec5dfd2db619"
  }
}

variable "subnet_public_c" {
  default = {
    # tomigaya-prd-public-c
    production = "subnet-047e94120ad948aee"
  }
}

variable "subnet_public_d" {
  default = {
    # tomigaya-prd-public-d
    production = "subnet-0cc2e9231ddce50c6"
  }
}

variable "app_security_group" {
  default = {
    # tomigaya-prd-internal-sg
    production = "sg-0a8623933ef2a95a3"
  }
}

variable "lb_security_group" {
  default = {
    # tomigaya-prd-lb-sg
    production = "sg-060efee85d30d5988"
  }
}

variable "env_key" {
  default = {
    production = "prd"
  }
}
# variable "db_security_group" {
#   default = {
#     staging    = ""
#     production = ""
#   }
# }

variable "vpc_id" {
  default = {
    #tomigaya-prd-vpc
    production = "vpc-04d8e28f0cf9c9979"
  }
}

variable "aws_account_id" {
  default = "312328096018"
}

variable "alb_certificate_arn" {
  default = "arn:aws:acm:ap-northeast-1:312328096018:certificate/5aca9248-6fc6-4cde-b2fd-9a3bbf01d690"
}

variable "cf_certificate_arn" {
  default = "arn:aws:acm:us-east-1:312328096018:certificate/c6d4d662-fe53-45c2-b0d0-a6ac242f053c"
}

variable "web_acl" {
  # tomigaya-developer-acl
  default = {
    "dev.id"        = ""
    "staging.id"    = ""
    "production.id" = "337a7fad-e5b6-49be-a9b6-d90493f2d8d3"
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
    "production.key" = "prd"
  }
}

variable "resources_bucket" {
  default = {
    "production.domain" = ""

    "production.origin_path" = "production"
  }
}
