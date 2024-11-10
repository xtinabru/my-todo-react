# Todo App 📝

## Overview
This Todo app is built using React for the frontend and NodeJS with Express for the backend. The app allows users to add, view, and delete tasks. It includes user authentication and authorization to ensure only logged-in users can manage tasks.

## Features ✨
1. **Task Management:**
   - Add new tasks ➕
   - View tasks 👀
   - Delete tasks 🗑️

2. **User Authentication:**
   - Sign up (register) 📝
   - Sign in (login) 🔑
   - Authorization for task management 🔒

3. **Persistent Data Storage:**
   - Tasks are stored in a PostgreSQL database 🗄️

## Project Structure 🏗️
- **Frontend:** React ⚛️
- **Backend:** NodeJS, Express 🟢
- **Database:** PostgreSQL 🐘

## Setup Instructions 🛠️

### Prerequisites 📋
- NodeJS (version 20.x) 🟢
- PostgreSQL 🐘

### Installation 💻

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd todo-app
2. Install dependencies for the backend:
```bash
cd server
npm install 
```
3. Install dependencies for the frontend:
```bash
cd ../client
npm install
```
### Database Setup 🗄️
   
Install PostgreSQL:

Follow the instructions on the PostgreSQL website to install PostgreSQL.

Create a database:

Open pgAdmin4 and create a new database named todo.

Run the SQL script:

Execute the SQL script located in the server folder to create the necessary tables.

### Running the Application 🚀
   
Start the backend server:
```bash
cd server
npm run devStart
```
Start the frontend:
```bash
cd ../client
npm start
```
###  Testing 🧪
Run automated tests for the backend:
```bash
cd server
npm test
```




