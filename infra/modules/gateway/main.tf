resource "aws_apigatewayv2_api" "api" {
  name          = "my-http-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "hello" {
  api_id = aws_apigatewayv2_api.api.id

  integration_type = "AWS_PROXY"
  integration_uri  = var.labmda_invoke_arn

  payload_format_version = "2.0"
}

########################################
# Route
########################################

resource "aws_apigatewayv2_route" "get_api_players" {
  api_id = aws_apigatewayv2_api.api.id

  route_key = "GET /api/players"

  target = "integrations/${aws_apigatewayv2_integration.hello.id}"
}

resource "aws_apigatewayv2_route" "post_api_players" {
  api_id = aws_apigatewayv2_api.api.id

  route_key = "POST /api/players"

  target = "integrations/${aws_apigatewayv2_integration.hello.id}"
}

resource "aws_apigatewayv2_route" "delete_api_players_id" {
  api_id = aws_apigatewayv2_api.api.id

  route_key = "DELETE /api/players/{id}"

  target = "integrations/${aws_apigatewayv2_integration.hello.id}"
}


resource "aws_apigatewayv2_stage" "default" {
  api_id = aws_apigatewayv2_api.api.id

  name        = "$default"
  auto_deploy = true

  default_route_settings {
    throttling_burst_limit = 5
    throttling_rate_limit = 10
  }
}

########################################
# Permission for API Gateway
########################################

resource "aws_lambda_permission" "api_gateway" {
  statement_id = "AllowExecutionFromAPIGateway"

  action        = "lambda:InvokeFunction"
  function_name = var.labmda_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}