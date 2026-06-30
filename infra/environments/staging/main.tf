terraform {
  required_version = ">= 1.15"

  backend "s3" {
    bucket = "project-players"
    key    = "terraform.tfstate"
    region = "us-east-1"
    dynamodb_table = "project_players"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}
