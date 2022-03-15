terraform {
  required_version = "= 1.1.5"

  backend "s3" {
    bucket               = "tomigaya-stg-terraform"
    region               = "ap-northeast-1"
    workspace_key_prefix = "aw-editorialhands-env:"
    key                  = "aw-editorialhands.terraform.tfstate"
  }
}

provider "aws" {
  region  = "ap-northeast-1"
}

provider "template" {}

variable "name" {
  default = "editorialhands"
}

variable "region" {
  default = "ap-northeast-1"
}

module "app" {
  source = "./modules"
  region = var.region
  name   = var.name
}
