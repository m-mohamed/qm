output "url" {
  value = "https://${var.hostname}"
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.site.id
}
