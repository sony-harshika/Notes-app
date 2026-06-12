# Notes App

A full stack notes application with login, built using Node.js, Express, and JavaScript.

# Features

- Register and login with a username and password
- Each user sees only their own notes
- Add a note with a title and content
- View all your notes in a grid
- Delete notes
- Data stored in a JSON file (no database setup needed)
- JWT authentication — stay logged in for 7 days
- Passwords hashed with bcrypt

## Tech Stack

 Frontend : HTML, CSS, JavaScript 
 Backend : Node.js, Express 
 Auth : JWT + bcrypt 
 Storage : JSON file 

## How to Run

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/notes-app.git

# Go into the folder
cd notes-app

# Install dependencies
npm install

# Start the server
npm start
```

Open your browser and go to: **http://localhost:3000**

## API Endpoints


 POST |/api/register | Create an account | No 
 POST |/api/login | Login and get token | No 
 GET | api/notes | Get all your notes | Yes 
 POST |/api/notes | Add a new note | Yes 
 DELETE| /api/notes/:id | Delete a note | Yes 

## Project Structure

```
notes-app/
├── public/
│   └── index.html    # Frontend (HTML + CSS + JS)
├── server.js         # Express backend + API
├── data.json         # Auto-generated data storage
├── package.json
└── README.md
```

---

Made by Yallala Soni Harshika
