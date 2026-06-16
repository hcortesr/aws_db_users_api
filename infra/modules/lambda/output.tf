output "lambda_arn" {
  value = aws_lambda_function.example.invoke_arn
}

output "lambda_name" {
  value = aws_lambda_function.example.function_name
}