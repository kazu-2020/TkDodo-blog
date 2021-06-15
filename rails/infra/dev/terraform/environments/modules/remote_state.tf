data "terraform_remote_state" "shared_resources" {
  backend = "s3"
  config = {
    bucket = "tomigaya-dev-terraform"
    key    = "cms1-global2/cms1-global.terraform.tfstate"
  }
}
