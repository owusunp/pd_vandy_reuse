
# Vandy Reuse Marketplace

Vandy Reuse Marketplace is a platform that allows Vanderbilt University students to sell and buy items they no longer use. The project consists of a frontend built with React and a backend powered by FastAPI.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed
- Poetry for Python dependency management
- Uvicorn for running the FastAPI backend

## Installation

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd /Users/owusunp/pd_vandy_reuse/frontend/
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

3. Start the frontend server:
   ```bash
   npm start
   ```

### Backend

1. Navigate to the backend directory:
   ```bash
   cd /Users/owusunp/pd_vandy_reuse/backend/app/
   ```

2. Ensure you're in the Poetry shell (if not, run `poetry shell` at the root of your project):
   ```bash
   poetry shell
   ```

3. Install the Python dependencies:
   ```bash
   poetry install
   ```

4. Run the backend with Uvicorn:
   ```bash
   poetry run uvicorn main:app --reload
   ```

## Running the Project

To run the project, follow these steps:

1. Start the frontend by running the commands in the `frontend` directory:
   ```bash
   npm start
   ```

2. Start the backend by running the commands in the `backend` directory:
   ```bash
   poetry run uvicorn main:app --reload
   ```

3. Ensure you're in the Poetry environment (run this at the root of your project):
   ```bash
   poetry shell
   ```

Once both the frontend and backend are running, you can access the application by navigating to the appropriate URLs in your web browser.

## Environment Variables

Make sure to add a `.env` file at the root of your project for environment-specific variables. The `.env` file should contain variables like API keys, database credentials, and other sensitive information. Make sure the `.env` file is included in your `.gitignore` to prevent it from being pushed to version control.

## Technologies Used

- **Frontend:** React, Stream.io for chat functionality
- **Backend:** FastAPI, Uvicorn
- **Database:** MongoDB
- **Package Manager:** Poetry (for Python), npm (for JavaScript)

## License

This project is licensed under the MIT License.
