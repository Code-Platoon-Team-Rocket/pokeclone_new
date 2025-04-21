variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-2"
}

variable "ec2_instance_type" {
  description = "EC2 instance type (used if you add EC2 later)"
  type        = string
  default     = "t3.micro"
}

variable "db_instance_type" {
  description = "RDS instance type"
  type        = string
  default     = "db.t3.micro"
}

variable "FLO_DB_USERNAME" {
  description = "Database username for RDS"
  type        = string
}

variable "FLO_DB_PASSWORD" {
  description = "Database password for RDS"
  type        = string
  sensitive   = true
}
