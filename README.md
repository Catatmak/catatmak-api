# Catatmak API

Welcome to the Catatmak API repository! This backend service provides APIs for mobile apps to seamlessly integrate and interact with the Catatmak platform.

## How to Install

Follow these steps to set up and run the Catatmak API:

1. Clone this repository:

    ```bash
    git clone https://github.com/catatmak/catatmak-api
    ```

2. Navigate to the project directory and install dependencies:

    ```bash
    cd catatmak-api
    npm install
    ```

3. Copy the `.env.example` file to `.env`:

    ```bash
    cp .env.example .env
    ```

4. Insert your Google Cloud service account credentials into `bin/config/gcloud.json`.

5. Start the API:

    ```bash
    npm run start
    ```

   or

    ```bash
    node index.js
    ```

6. Congratulations! The API is now successfully running.

## Postman Collection

Explore the Catatmak API endpoints using the [Postman Collection](https://documenter.getpostman.com/view/4289441/2s9YkgC5Db).

## Cloud Run Docker Builds

If you want to deploy the Catatmak API using Docker and Google Cloud Run, follow these steps:

1. Build the Docker image:

    ```bash
    docker buildx build --platform linux/amd64 -t catatmak-api:v1.6 .
    ```

2. Tag the Docker image:

    ```bash
    docker tag {image_id} gcr.io/catatmak/catatmak-api:v1.6
    ```

3. Push the Docker image to Google Container Registry:

    ```bash
    docker push gcr.io/catatmak/catatmak-api:v1.6
    ```

Feel free to adjust the version number (`v1.6` in this example) as needed.

## Contributing

We welcome contributions to enhance the Catatmak API. Fork the repository, make your changes, and submit a pull request. Let's build an awesome platform together!

Happy coding!