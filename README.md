# PokeClone

PokeClone is an educational project that combines the power of a React front-end framework with a Django back-end. This collaborative effort represents the first-time collaboration of the development team, showcasing their collective skills and aspirations in game development. It is important to note that the project is not deployed, and there is no intention for profit or monetary gain. The goal of PokeClone is to provide users with a Pokemon-inspired gaming experience where they can embark on a virtual journey, capture Pokemon, and train them to challenge the Gym leader.

## Authors

- [@ClaireinCode](https://github.com/ClaireinCode)
- [@phubui1996](https://github.com/phubui1996)
- [@Jkim1122](https://github.com/Jkim1122)



Project Deployment Guide
This guide outlines the steps for setting up a full-stack application with infrastructure provisioning, containerization, orchestration, and CI/CD pipelines.

🗃️ Repository Structure
infrastructure/ – Terraform configurations

backend/ – Flask API backend

frontend/ – React frontend

☁️ Infrastructure Provisioning (Terraform on AWS)
Terraform File Structure
backend.tf – S3 bucket for state management

ec2.tf – EC2 instance (us-east-2)

eks.tf – EKS Cluster with private node group

iam.tf – IAM roles for EKS cluster and nodes

main.tf – AWS provider and region config

networking.tf – VPC setup

Public Subnets (x2)

Private Subnets (x2)

Route Tables (public & private)

NAT Gateway, EIP

Subnet groups

outputs.tf

rds.tf

security.tf

variables.tf

🔐 Remote state configured via S3 and DynamoDB

🐳 Dockerization
Backend (Dockerfile)
Based on python:alpine

Copies and installs from requirements.txt

Exposes port 8000

bash
Copy
Edit
docker build -t jeremyhuegel/back_end:latest .
docker push jeremyhuegel/back_end:latest
Frontend (Dockerfile)
Multi-stage build: Node + Nginx (Alpine)

Copies production build assets

Exposes port 80

bash
Copy
Edit
docker build -t jeremyhuegel/front_end:latest .
docker push jeremyhuegel/front_end:latest
🧪 Docker Compose (Local Testing)
Create a docker-compose.yml file with:

Backend and frontend services

Postgres (Alpine) for DB

Volume for persistence

Environment variables

Run locally:

bash
Copy
Edit
docker-compose up -d
⚙️ CI/CD with GitHub Actions
Workflow Files
Located in .github/workflows/

terraform-apply.yml – Deploy infrastructure

terraform-destroy.yml – Teardown infrastructure

Includes secrets: AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY

☸️ Kubernetes Orchestration
Secrets
Store all sensitive env variables in secrets.yml

Backend
Deployment: Uses env vars (DJANGO_KEY, POSTGRES_USER, etc.)

Service: ClusterIP, port 8000

Frontend
Deployment: Uses API_URL from secrets

Includes readiness/liveness probes

Service: LoadBalancer, port 80

Postgres
Deployment: Alpine image, port 5432

Uses POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD

Service: ClusterIP, port 5432

🔧 Optional: Bash scripts to deploy/teardown Kubernetes resources
Make scripts executable:

bash
Copy
Edit
chmod +x deploy.sh teardown.sh
🛠️ Final Optimization
Update app.py for backend logic

Modify utilities.jsx to use API_URL environment variable



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
