variable "name" {}
variable "region" {}

variable "backend_domain" {
  default = {
    staging    = "stg-api-eh.nr.nhk.jp"
    production = ""
  }
}

variable "frontend_domain" {
  default = {
    staging    = "stg-eh.nr.nhk.jp"
    production = ""
  }
}

variable "subnet_private_a" {
  default = {
    # tomigaya-stg-nat-a
    staging    = "subnet-0e36ffd7aa4e0f4e7"
    production = ""
  }
}

variable "subnet_private_c" {
  default = {
    # tomigaya-stg-nat-c
    staging    = "subnet-01ce4af3336238719"
    production = ""
  }
}

variable "subnet_private_d" {
  default = {
    # tomigaya-stg-nat-d
    staging    = "subnet-08a00ddb3fba292e2"
    production = ""
  }
}

variable "subnet_public_a" {
  default = {
    # tomigaya-stg-public-a
    staging    = "subnet-05e2eaae36b925d3d"
    production = ""
  }
}

variable "subnet_public_c" {
  default = {
    # tomigaya-stg-public-c
    staging    = "subnet-001ab3a31c85022f0"
    production = ""
  }
}

variable "subnet_public_d" {
  default = {
    # tomigaya-stg-public-d
    staging    = "subnet-06f31e88a763e1e67"
    production = ""
  }
}

variable "app_security_group" {
  default = {
    # tomigaya-stg-internal-sg
    staging    = "sg-0a8bf8ff25d36fd2b"
    production = ""
  }
}

variable "lb_security_group" {
  default = {
    # tomigaya-dev-lb-sg
    staging    = "sg-048ac093c56844da9"
    production = ""
  }
}

variable "env_key" {
  default = {
    staging = "stg"
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
    #tomigaya-stg-vpc
    staging    = "vpc-0ef2054fa471f908d"
    production = ""
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
    "staging.id"    = "337a7fad-e5b6-49be-a9b6-d90493f2d8d3"
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
