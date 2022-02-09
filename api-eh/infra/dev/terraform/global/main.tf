terraform {
  required_version = "= 0.13.7"

  backend "s3" {
    bucket = "tomigaya-dev-terraform"
    key    = "aw-editorialhands-global/aw-editorialhands-global.terraform.tfstate"
  }
}

provider "aws" {
  version = "~> 3.74.1"
  region  = "ap-northeast-1"
}

provider "template" {
  version = "= 2.1.2"
}

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
