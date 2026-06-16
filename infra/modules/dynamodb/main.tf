resource "aws_dynamodb_table" "players_table" {
  name         = var.table_name
  billing_mode = "PAY_PER_REQUEST"

  hash_key  = "Id"

  attribute {
    name = "Id"
    type = "S"
  }
  
}