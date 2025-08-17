# PANTOhealth IoT Data Management System

This repository contains the solution for the PANTOhealth Backend Developer Technical Assessment.

## Architecture Overview

The system consists of two main applications and two backing services, orchestrated with Docker:

- **`pantohealth-backend`**: A NestJS application that:
  - Consumes X-ray data from a RabbitMQ queue.
  - Processes the data to extract metadata (`dataLength`, `dataVolume`).
  - Stores the processed signal data in a MongoDB database.
  - Exposes a RESTful API with Swagger documentation for CRUD operations on the signal data.
- **`pantohealth-producer`**: A lightweight NestJS application that simulates IoT devices by:
  - Reading a sample `x-ray.json` data file.
  - Periodically publishing messages for random devices to a RabbitMQ exchange.
- **RabbitMQ**: The message broker that decouples the producer and the backend.
- **MongoDB**: The NoSQL database used for data persistence.

---

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development without Docker)
- A code editor like VS Code

### Running with Docker (Recommended)

This is the easiest way to run the entire application stack.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Axiean/panto-health
    cd panto-health
    ```

2.  **Create Environment Files:**
    The project uses `.env` files for configuration. Copy the example templates to create your local configurations.

    ```bash
    # For the backend service
    cp pantohealth-backend/.env.example pantohealth-backend/.env

    # For the producer service
    cp pantohealth-producer/.env.example pantohealth-producer/.env
    ```

    _You do not need to edit these files to run the project with Docker Compose._

3.  **Build and Run with Docker Compose:**
    ```bash
    docker-compose up --build
    ```
    This single command will build the Docker images, start all four containers, and connect them on a shared network. The backend will become available after a few moments.

This command will build the Docker images for both the backend and producer and start all four containers (`backend`, `producer`, `rabbitmq`, `mongo`).

### Endpoints

- **API**: `http://localhost:3000`
- **Swagger Documentation**: `http://localhost:3000/api`
- **RabbitMQ Management**: `http://localhost:15672` (user: `guest`, pass: `guest`)

---

## Local Development (Without Docker)

If you wish to run the applications locally, you will need to have RabbitMQ and MongoDB instances running.

1.  **Install dependencies for both projects:**

    ```bash
    # In /pantohealth-backend
    npm install

    # In /pantohealth-producer
    npm install
    ```

2.  **Create `.env` files** in the root of both `pantohealth-backend` and `pantohealth-producer` and populate them based on the `.env.example` files.

3.  **Run the applications:**

    ```bash
    # In one terminal, for the backend
    cd pantohealth-backend
    npm run start:dev

    # In another terminal, for the producer
    cd pantohealth-producer
    npm run start:dev
    ```

---

## Testing

Unit and End-to-End tests are included in the `pantohealth-backend` application.

```bash
# Navigate to the backend directory
cd pantohealth-backend

# Run unit tests
npm run test

```
