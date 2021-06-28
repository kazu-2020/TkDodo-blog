data "terraform_remote_state" "shared_resources" {
  backend = "s3"
  config = {
    bucket = "tomigaya-dev-terraform"
    key    = "aw-editorialhands-global/aw-editorialhands-global.terraform.tfstate"
  }
}
