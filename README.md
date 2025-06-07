# notesServer

# Running the Project with Docker Compose

1. Make sure Docker and Docker Compose are installed on your system.

2. Clone the project or have the project files ready.

3. Run the following command in the project directory to build and start the containers:

```
docker-compose up --build
```

4. Once the containers are up, the app will be accessible at: http://localhost:2070



**Note:**
- Environment Variables
    MONGO_URL: MongoDB connection string, e.g.,
```
  mongodb://mongo:27017/NoteApp`
```
