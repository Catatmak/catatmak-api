Catatmak API

docker buildx build --platform linux/amd64 -t catatmak-api:v1.1 .
docker tag {image_id} gcr.io/catatmak/catatmak-api:v1.1
docker push gcr.io/catatmak/catatmak-api:v1.1