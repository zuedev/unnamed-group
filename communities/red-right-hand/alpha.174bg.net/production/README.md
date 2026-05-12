# 174bg.net Production Environment

This directory contains the production environment specification for 174bg.net, which is the main website for the Red Right Hand community.

## Deployment

We use [Docker Compose](https://docs.docker.com/compose/) to manage our production environment. The `docker-compose.yml` file defines the services, networks, and volumes needed to run the application in production.

To deploy the application, follow these steps:

1. Ensure you have Docker and Docker Compose installed on your production server.
2. Copy the `docker-compose.yml` file to your server.
3. Run the following command to start the application: `docker-compose up -d`.
4. The application will be accessible at `http://174bg-net:3000`.
