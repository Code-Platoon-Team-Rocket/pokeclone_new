# PokeClone

PokeClone is an educational project that combines the power of a React front-end framework with a Django back-end. This collaborative effort represents the first-time collaboration of the development team, showcasing their collective skills and aspirations in game development. It is important to note that the project is not deployed, and there is no intention for profit or monetary gain. The goal of PokeClone is to provide users with a Pokemon-inspired gaming experience where they can embark on a virtual journey, capture Pokemon, and train them to challenge the Gym leader.

## Authors

- Andy Nguyen
- FLO
- Jeremy Huegel


## Features
User Authentication: Secure signup and login functionality to personalize the gaming experience.
##
Pokemon Integration: Utilizes images from pokeapi.co to provide an immersive Pokemon atmosphere.
##
PokeTeam CRUD Capability: Users can manage their PokeTeam effectively, capturing and training Pokemon.

## User Journey
1. Registration: Users can sign up and create an account to commence their PokeClone adventure.

2. Pokemon Selection: Choose a starter Pokemon to kickstart your journey and add it to your PokeTeam.

3. Training Grounds: Capture more Pokemon and train them to build a formidable team.

4. PokeCenter: Visit the PokeCenter to heal your Pokemon back to full health after battles.

5. Home Base: Customize your team by selecting up to six Pokemon from your captured collection.

6. Pokedex Exploration: Open the Pokedex to view detailed statistics of all encountered Pokemon.


## 🧬 PokeClone Deployment Guide
This guide walks through cloning, provisioning, Dockerizing, orchestrating, and automating deployment of the PokeClone application using AWS, Terraform, Docker, and Kubernetes.

📁 Project Structure
pokeclone/
├── back_end/         # Django backend
├── front_end/        # React frontend
├── IAC/              # Infrastructure-as-Code (Terraform)
└── Kubernetes/       # Kubernetes manifests


🔧 Infrastructure Provisioning (Terraform on AWS)
Navigate to the IAC/ directory and apply the following Terraform files.

✅ main.tf
-Specifies AWS as the infrastructure provider

-Specifies AWS region where infrastructure is created

✅ variables.tf
-Defines AWS region

-Defines RDS instance type

-Defines database username

-Defines database password


✅ iam.tf
-Create overarching Identity and Access Management (IAM) cluster and node roles


✅ networking.tf
-Creates an AWS Virtual Private Cloud (VPC)

-Creates an Internet Gateway (IGW)

-Creates 2 AWS public subnets

-Creates 2 AWS private subnets

-Createss an AWS public route table and associates the VPC with the route table

-Creates an AWS private route table and associates both private subnets and the VPC with route table 

-Create an AWS Elastic IP (EIP) resource

-Creates an AWS Network Address Translation (NAT) gateway

-Create an AWS database subnet group for Amazon Relational Database Service (RDS) instances


✅ security.tf
-Defines an AWS security group for the EKS nodes in the cluster
  a. Allows all internal ingress node-to-node traffic to and from any port
  b. Allows all egress traffic to and from any port

- Define aws security group for rds
  a. Allows PostgreSQL ingress traffic through port 5432
  b. Allows PostgreSQL egress traffic through any port



✅ eks.tf
-Creates an Elastic Kubernetes Service (EKS) cluster and with specific VPC configurations
-Create an EKS node group for private subnets

✅ rds.tf
-Creates an Amazon RDS Postgres instance


✅ backend.tf
-Creates an S3 bucket resource to store Terraform state remotely with DynamoDB to store lock


✅ monitoring.tf
-Creates aws_cloudwatch_metric_alarm.eks_cpu_high
-Creates aws_sns_topic (both cpu_alarm_topic & rds_snapshot_topic)
-Sets up aws_sns_topic_subscription via email protocol to “flomihciu@gmail.com”


✅ outputs.tf
-Output RDS endpoint
-Output EKS cluster name
-Output EKS cluster region 
-Output EKS cluster endpoint


🐳 Dockerization
📦 Backend
-cd back_end/
-docker build -t <your_dockerhub_username>/pokeclone_backend:latest .
-docker push <your_dockerhub_username>/pokeclone_backend:latest

📦 Frontend
-cd front_end/
-docker build -t <your_dockerhub_username>/pokeclone_frontend:latest .
-docker push <your_dockerhub_username>/pokeclone_frontend:latest

🧪 Docker Compose (Local Testing)
-Create a docker-compose.yml file with:

-Backend and frontend services

-Postgres:alpine image

-Environment variables

-Volume for DB persistence

-Run Compose:
- docker-compose up -d
Apply Migrations:
bash
Copy
Edit
docker compose run backend python manage.py makemigrations
docker compose run backend python manage.py migrate
⚙️ CI/CD with GitHub Actions
In .github/workflows/, you’ll find:

✅ workflow.yml
Runs terraform apply

Builds and pushes Docker images (with GitHub Actions run number as tag)

Triggers rolling restarts by updating Kubernetes deployments with new image versions

✅ terraform-destroy.yml
Destroys infrastructure created by Terraform

☸️ Kubernetes Orchestration
All Kubernetes manifests are in the Kubernetes/ directory.

🔐 Secrets
secrets.yml:

yaml
Copy
Edit
metadata:
  name: django-secret
data:
  POSTGRES_USER: ...
  POSTGRES_PASSWORD: ...
  POSTGRES_DB: ...
  DJANGO_KEY: ...
  DB_HOST: ...
All values should be Base64 encoded.

📦 Backend
backend-deployment.yml:

Uses environment variables from secrets.yml

backend-deployment-service.yml:

Service type: ClusterIP, port 8000

🌐 Frontend
frontend-deployment.yml:

Includes API_URL from secrets

Readiness and liveness probes

frontend-service.yml:

Service type: LoadBalancer, port 80

🗄️ PostgreSQL
postgres-deployment.yml:

Uses postgres:alpine

Ports: 5432

postgres-service.yml:

Service type: ClusterIP, port 5432

🛠 Optional Scripts
Create bash scripts to automate Kubernetes deployment/teardown.

bash
Copy
Edit
chmod +x deploy.sh teardown.sh
🚀 Pipeline Optimization
Modify app.py as needed

Update utilities.jsx to reference the API_URL environment variable


## Technologies

Front-end: React, Bootstrap, HTML5, CSS3
<a href="https://reactjs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/> </a> <a href="https://getbootstrap.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/bootstrap/bootstrap-plain-wordmark.svg" alt="bootstrap" width="40" height="40"/> </a>  <a href="https://www.w3.org/html/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" width="40" height="40"/> </a> <a href="https://www.w3schools.com/css/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" width="40" height="40"/> </a>

Back-end: Django, PostgreSQL
<a href="https://www.djangoproject.com/" target="_blank" rel="noreferrer"> <img src="https://cdn.worldvectorlogo.com/logos/django.svg" alt="django" width="40" height="40"/> </a> <a href="https://www.postgresql.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" alt="postgresql" width="40" height="40"/> </a> 

Languages: JavaScript, Python
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> </a><a href="https://www.python.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" alt="python" width="40" height="40"/> </a>

<!-- <p align="left">    </p> -->

## Screenshots

![App Screenshot](drawsql-pokeclone.png)
![App Screenshot](tldraw-pokeclone.png)

![App Screenshot](/PC_Screenshots/PC_Landing.png)
![App Screenshot](/PC_Screenshots/PC_Sign_Up.png)
![App Screenshot](/PC_Screenshots/PC_Log_In.png)
![App Screenshot](/PC_Screenshots/PC_Home.png)
![App Screenshot](/PC_Screenshots/PC_Starter.png)
![App Screenshot](/PC_Screenshots/PC_Intro.png)
![App Screenshot](/PC_Screenshots/PC_Map.png)
![App Screenshot](/PC_Screenshots/PC_House.png)
![App Screenshot](/PC_Screenshots/PC_Pokedex.png)
![App Screenshot](/PC_Screenshots/PC_Battle.png)
![App Screenshot](/PC_Screenshots/PC_Change_Pokemon.png)
![App Screenshot](/PC_Screenshots/PC_Victory.png)
![App Screenshot](/PC_Screenshots/PC_PokeCenter.png)
![App Screenshot](/PC_Screenshots/PC_Gym.png)
![App Screenshot](/PC_Screenshots/PC_Gameover.png)

Here is a video presentation showcasing development and functionality: https://youtu.be/WSusU5mbaPI?t=3361
