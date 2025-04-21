resource "aws_db_instance" "team_rocket_db" {
  identifier             = "team-rocket-postgres-db"
  engine                 = "postgres"
  instance_class         = var.db_instance_type
  allocated_storage      = 20
  username               = var.FLO_DB_USERNAME
  password               = var.FLO_DB_PASSWORD
  publicly_accessible    = false
  skip_final_snapshot    = true

  db_subnet_group_name   = aws_db_subnet_group.db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]

  tags = {
    Name = "team-rocket-db-instance"
  }
}
