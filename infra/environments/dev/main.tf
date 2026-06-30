module "dynamodb" {
  source = "../../modules/dynamodb"

  table_name = var.table_name
}

module "lambda" {
  source        = "../../modules/lambda"
  db_dynamo_arn = module.dynamodb.db_arn
}
module "Gateway" {
  source            = "../../modules/gateway"
  labmda_invoke_arn = module.lambda.lambda_arn
  labmda_name       = module.lambda.lambda_name


}
module "S3" {
  source = "../../modules/s3"
}