# Fetch available AZs dynamically
data "aws_availability_zones" "available" {}

# VPC
resource "aws_vpc" "main_vpc" {
  cidr_block           = "10.88.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name   = "team-rocket-vpc"
    Region = var.aws_region
  }
}

# Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main_vpc.id

  tags = {
    Name = "team-rocket-igw"
  }
}

# Public Subnet 1
resource "aws_subnet" "public_subnet_1" {
  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = "10.88.1.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = {
    Name                                     = "team-rocket-public-subnet-1"
    "kubernetes.io/role/elb"                = "1"
    "kubernetes.io/cluster/team-rocket-eks" = "owned"
  }
}

# Public Subnet 2
resource "aws_subnet" "public_subnet_2" {
  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = "10.88.2.0/24"
  availability_zone       = data.aws_availability_zones.available.names[1]
  map_public_ip_on_launch = true

  tags = {
    Name                                     = "team-rocket-public-subnet-2"
    "kubernetes.io/role/elb"                = "1"
    "kubernetes.io/cluster/team-rocket-eks" = "owned"
  }
}

# Private Subnet 1 (updated)
resource "aws_subnet" "private_subnet_1" {
  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = "10.88.3.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true  # <- changed from false to true

  tags = {
    Name                                     = "team-rocket-private-subnet-1"
    "kubernetes.io/role/internal-elb"       = "1"
    "kubernetes.io/cluster/team-rocket-eks" = "owned"
  }
}

# Private Subnet 2 (updated)
resource "aws_subnet" "private_subnet_2" {
  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = "10.88.4.0/24"
  availability_zone       = data.aws_availability_zones.available.names[1]
  map_public_ip_on_launch = true  # <- changed from false to true

  tags = {
    Name                                     = "team-rocket-private-subnet-2"
    "kubernetes.io/role/internal-elb"       = "1"
    "kubernetes.io/cluster/team-rocket-eks" = "owned"
  }
}

# Public Route Table
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "team-rocket-public-rt"
  }
}

resource "aws_main_route_table_association" "public_main_assoc" {
  vpc_id         = aws_vpc.main_vpc.id
  route_table_id = aws_route_table.public_rt.id
}

# Elastic IP for NAT Gateway
resource "aws_eip" "nat_eip" {
  domain     = "vpc"
  depends_on = [aws_internet_gateway.igw]
}

# NAT Gateway
resource "aws_nat_gateway" "nat_gw" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.public_subnet_1.id
  depends_on    = [aws_internet_gateway.igw]

  tags = {
    Name = "team-rocket-nat-gateway"
  }
}

# Private Route Table
resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.main_vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gw.id
  }

  tags = {
    Name = "team-rocket-private-rt"
  }
}

resource "aws_route_table_association" "private_rta_1" {
  subnet_id      = aws_subnet.private_subnet_1.id
  route_table_id = aws_route_table.private_rt.id
}

resource "aws_route_table_association" "private_rta_2" {
  subnet_id      = aws_subnet.private_subnet_2.id
  route_table_id = aws_route_table.private_rt.id
}

# RDS Subnet Group
resource "aws_db_subnet_group" "db_subnet_group" {
  name = "team-rocket-db-subnet-group"

  subnet_ids = [
    aws_subnet.private_subnet_1.id,
    aws_subnet.private_subnet_2.id
  ]

  tags = {
    Name = "team-rocket-db-subnet-group"
  }
}
