all: frontend backend deploy

.PHONY: frontend
frontend: 
	docker build -t registry.service.consul:5000/social-network-frontend:27 -f frontend/Dockerfile frontend
	docker push registry.service.consul:5000/social-network-frontend:27 

.PHONY: backend
backend:
	docker build -t registry.service.consul:5000/social-network-backend:27 -f backend/Dockerfile backend
	docker push registry.service.consul:5000/social-network-backend:27

deploy:
	nomad run job.hcl