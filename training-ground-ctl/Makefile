
default:
	go build

image:
	docker build --build-arg "SSH_PRIVATE_KEY=$$(cat ~/.ssh/id_rsa)" -t gcr.io/medea-area-51/training-ground-ctl .
	docker push gcr.io/medea-area-51/training-ground-ctl

.PHONY: default image
