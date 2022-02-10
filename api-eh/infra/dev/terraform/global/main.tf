terraform {
  required_version = "= 0.14.11"

  backend "s3" {
    bucket = "tomigaya-dev-terraform"
    key    = "aw-editorialhands-global/aw-editorialhands-global.terraform.tfstate"
  }
}

provider "aws" {
  region  = "ap-northeast-1"
}

provider "template" {}

variable "name" {
  default = "aw-editorialhands"
}

variable "region" {
  default = "ap-northeast-1"
}

module "app" {
  source = "./modules"
  region = var.region
  name   = var.name
}
