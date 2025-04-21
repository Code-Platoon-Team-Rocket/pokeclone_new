resource "aws_instance" "team_rocket_dev" {
  ami                         = "ami-04f167a56786e4b09" #ubuntu
  instance_type               = var.ec2_instance_type
  subnet_id                   = aws_subnet.public_subnet_1.id
  vpc_security_group_ids      = [aws_security_group.eks_node_sg.id]
  associate_public_ip_address = true

  tags = {
    Name = "team-rocket-dev-instance"
  }
}
