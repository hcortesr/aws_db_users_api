# MySQL Manager App

A minimal Express.js app to add, view, and delete records from a MySQL database.

## Stack
- **Backend**: Express.js + mysql2
- **Frontend**: HTML + Tailwind CSS (CDN) + vanilla JS

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure your database
Edit the `DB_CONFIG` object at the top of `server.js`:
```js
const DB_CONFIG = {
  host: "localhost",
  user: "root",
  password: "your_password",
  database: "myapp",   // auto-created if it doesn't exist
  port: 3306,
};
```
Or use environment variables (copy `.env.example` → `.env` and fill in values, then use a package like `dotenv`).

### 3. Run
```bash
node server.js
```

Then open **http://localhost:3000**

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/items` | Fetch all records |
| POST | `/api/items` | Add a record `{ "value": "..." }` |
| DELETE | `/api/items/:id` | Delete a record by ID |
