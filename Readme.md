# Habit Tracker Backend

The Habit Tracker Backend is a Node.js application that provides APIs for managing user habits and tracking progress. It supports CRUD operations for habits and ensures seamless communication with the frontend.

---

## Features

- CRUD operations for habits
- MongoDB integration for data storage
- RESTful API design
- Modular and scalable codebase
- Error handling and input validation
- CORS enabled for frontend-backend communication

---

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm (comes with Node.js)

### Steps
1. Clone the repository:
   ```bash
   https://github.com/rohanmistry231/Habit-Tracker-Backend.git
   cd Habit-Tracker-Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following content:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/habit-tracker
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. The server will run on `http://localhost:5000`.

---

## API Endpoints

### Habit Endpoints
- **GET /habits**: Fetch all habits
- **POST /habits**: Add a new habit
- **GET /habits/:id**: Fetch a specific habit by ID
- **PUT /habits/:id**: Update a habit by ID
- **DELETE /habits/:id**: Delete a habit by ID

### Example Habit JSON
```json
{
  "name": "Exercise",
  "description": "Daily 30-minute workout"
}
```

---