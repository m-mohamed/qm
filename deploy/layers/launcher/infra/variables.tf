variable "account_id" {
  type = string
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "hostname" {
  type = string
}

variable "route53_zone_id" {
  type = string
}

variable "certificate_arn" {
  type = string
}

variable "bucket_name" {
  type = string
}
