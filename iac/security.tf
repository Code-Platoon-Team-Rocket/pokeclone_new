# Security Group for EKS Worker Nodes
resource "aws_security_group" "eks_node_sg" {
  name        = "team-rocket-eks-node-sg"
  description = "Allow traffic to/from EKS nodes"
  vpc_id      = aws_vpc.main_vpc.id

  # Allow all traffic within the node group
  ingress {
    description = "Allow internal node-to-node traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    self        = true
  }

  # Allow all egress
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "team-rocket-eks-node-sg"
  }
}

# Security Group for RDS (PostgreSQL)
resource "aws_security_group" "rds_sg" {
  name        = "team-rocket-db-sg"
  description = "Allow access to PostgreSQL from EKS nodes"
  vpc_id      = aws_vpc.main_vpc.id

  ingress {
    description     = "Allow PostgreSQL from EKS nodes"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_node_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "team-rocket-db-sg"
  }
}
