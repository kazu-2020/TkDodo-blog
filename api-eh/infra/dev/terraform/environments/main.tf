terraform {
  required_version = "= 0.12.31"

  backend "s3" {
    bucket               = "tomigaya-dev-terraform"
    region               = "ap-northeast-1"
    workspace_key_prefix = "aw-editorialhands-env:"
    key                  = "aw-editorialhands.terraform.tfstate"
  }
}

provider "aws" {
  version = "~> 2.70"
  region  = "ap-northeast-1"
}

provider "template" {
  version = "= 2.1.2"
}

variable "name" {
  default = "api-eh"
}

variable "region" {
  default = "ap-northeast-1"
}

module "app" {
  source = "./modules"
  region = "${var.region}"
  name   = "${var.name}"
}
