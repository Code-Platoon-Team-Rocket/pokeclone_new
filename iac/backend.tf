terraform {
  backend "s3" {
    bucket         = "team-rocket-terraform-state-east2"
    key            = "state/terraform.tfstate"
    region         = "us-east-2"
    dynamodb_table = "team-rocket-lock-table"
  }
}