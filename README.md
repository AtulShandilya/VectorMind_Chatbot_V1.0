# Chat Web App

A beautiful chat web application with Apple-like design, featuring admin login, query/input modes, file uploads, and query history.

## Features

- **Apple-like Design**: Clean, modern white background interface
- **Admin Login**: Secure admin authentication
- **Dual Mode (Admin)**: 
  - Query mode: Prepends "query" to messages
  - Input mode: Prepends "input" to messages
- **File Upload**: Attach files along with text messages
- **Query History**: Sidebar showing recent queries that can be clicked to replay
- **User Mode**: Normal users see simplified interface with all messages sent as "input"

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Admin Login

- Username: `admin`
- Password: `admin`

## API Endpoint

The chat API endpoint is located at `/api/chat`. Update the route handler in `app/api/chat/route.ts` to connect to your actual chat API service.




