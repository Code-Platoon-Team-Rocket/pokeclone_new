#!/bin/bash

echo "front_end..."
kubectl delete -f frontend_service.yml
kubectl delete -f frontend_deployment.yml

echo "back_end.."
kubectl delete -f backend_service.yml
kubectl delete -f backend_deployment.yml

echo "Deleting postgres..."
kubectl delete -f postgres_service.yml
kubectl delete -f postgres_deployment.yml



echo "Deleting secrets..."
kubectl delete -f secrets.yml

echo "All resources deleted. 🔥"

#always change chmod +x
#run with ./teardown.sh

#!/bin/bash
