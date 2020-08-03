resource "aws_dynamodb_table" "books" {
  name     = "${var.environment}-books"
  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }

  write_capacity = "${var.write_capacity}"
  read_capacity  = "${var.read_capacity}"
  stream_enabled = true
  stream_view_type = "NEW_IMAGE"
}

resource "aws_ssm_parameter" "dynamodb_books_table" {
  name  = "${var.environment}-dynamodb-books-table"
  type  = "String"
  value = "${aws_dynamodb_table.books.name}"
}

resource "aws_ssm_parameter" "dynamodb_stream_books_table" {
  name  = "${var.environment}-dynamodb-stream-books-table"
  type  = "String"
  value = "${aws_dynamodb_table.books.stream_arn}"
}
