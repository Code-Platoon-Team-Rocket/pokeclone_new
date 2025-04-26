#!/bin/bash

echo "Applying secrets..."
kubectl apply -f secrets.yml


echo "Deploying postgres..."
kubectl apply -f postgres_deployment.yml
kubectl apply -f postgres_service.yml

echo "Deploying backend..."
kubectl apply -f backend_deployment.yml
kubectl apply -f backend_service.yml

echo "Deploying frontend..."
kubectl apply -f frontend_deployment.yml
kubectl apply -f frontend_service.yml


echo "All resources applied! 🚀"
