# Chat Web App

A modern, beautiful chat web application built with Next.js 14, featuring an Apple-like design, admin authentication, multiple interaction modes, and seamless API integration.

## 🎯 Overview

This application provides a clean, user-friendly chat interface with two distinct user experiences:
- **Regular Users**: Simplified interface with query-based messaging
- **Admin Users**: Advanced interface with multiple modes (Query, Input, Data) and additional controls

## ✨ Features

### Core Features
- **Apple-like Design**: Clean, modern white background with smooth transitions and rounded corners
- **Responsive UI**: Fully responsive design that works on all screen sizes
- **Real-time Chat**: Instant message sending and receiving with auto-scroll
- **File Upload**: Attach files along with text messages
- **Query History**: Sidebar with recent queries that can be clicked to reuse

### Admin Features
- **Admin Authentication**: Secure login system with localStorage persistence
- **Multiple Modes**: 
  - **Query Mode**: For querying information
  - **Input Mode**: For inputting data
  - **Data Mode**: For data operations with Get/Delete functionality
- **Model Selection**: Choose between different AI models (gemini-2.5-flash-preview-05-20, gemma3:12b)
- **Operation Controls**: Get/Delete operations when in Data mode

### User Experience Features
- **Auto-scroll**: Chat window automatically scrolls to bottom on new messages
- **Message History**: Persistent query history in sidebar
- **Clean Display**: Original message text displayed without internal prefixes
- **Error Handling**: Graceful error messages for failed API requests

## 🏗️ Project Structure

```
chat/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API route handler (placeholder)
│   ├── globals.css                # Global styles with Tailwind
│   ├── layout.tsx                 # Root layout component
│   └── page.tsx                   # Main page with auth logic
├── components/
│   ├── ChatInterface.tsx          # Main chat container and logic
│   ├── ChatInput.tsx              # Message input with mode controls
│   ├── ChatSidebar.tsx            # Query history sidebar
│   ├── LoginModal.tsx             # Admin login modal
│   └── MessageList.tsx            # Message display component
├── package.json
├── tailwind.config.js             # Tailwind CSS configuration
└── tsconfig.json                  # TypeScript configuration
```

## 📦 Component Explanation

### 1. `app/page.tsx` - Main Entry Point
- Manages authentication state (admin/normal user)
- Handles login/logout functionality
- Renders the main header and chat interface
- Persistent admin status using localStorage

**Key Features:**
- Admin status persistence across page refreshes
- Login modal integration
- Clean header with admin status indicator

### 2. `components/ChatInterface.tsx` - Core Chat Logic
The heart of the application that manages:
- Message state and history
- API communication
- Query history management
- Model selection
- Auto-scrolling behavior

**Key Functions:**
- `handleSendMessage()`: Processes and sends messages to API
  - Determines message mode (query/input/data)
  - Sends `select`, `message`, `model`, `operation` (if data mode), and `file` (if attached)
  - Parses responses based on mode (uses `answer` for query, `message` for input)
  - Cleans response text by removing `(Chunk...)` patterns
- `scrollToBottom()`: Ensures chat always shows latest messages
- `handleSelectQuery()`: Populates input with selected query from history

**API Request Format:**
```javascript
{
  message: "user's original text",
  select: "query" | "input" | "data",
  model: "gemini-2.5-flash-preview-05-20" | "gemma3:12b",
  operation: "get" | "delete"  // Only when select === "data"
  file: File  // Optional
}
```

**Response Parsing:**
- Query mode: `response.answer`
- Input mode: `response.message`
- Both responses are cleaned of `(Chunk...)` patterns

### 3. `components/ChatInput.tsx` - Input Component
Handles user input with mode selection for admins.

**Admin Features:**
- Three mutually exclusive mode buttons: Query, Input, Data
- When Data is selected, shows Get/Delete operation buttons
- File attachment with preview
- Auto-resizing textarea

**User Experience:**
- Normal users: All messages sent as "query" mode
- Admin users: Can choose between Query, Input, or Data modes
- Enter key sends message, Shift+Enter creates new line

### 4. `components/MessageList.tsx` - Message Display
Renders chat messages with:
- User messages on right (blue background)
- Assistant messages on left (gray background)
- File previews for attached files
- Timestamps for each message
- Clean display of original text (no internal prefixes shown)

### 5. `components/ChatSidebar.tsx` - Query History
Displays recent queries in a sidebar:
- Shows last 10 queries
- Clickable items that populate input field
- Persistent across page refreshes (localStorage)
- Only queries are stored in history (not inputs or data operations)

### 6. `components/LoginModal.tsx` - Authentication
Admin login interface:
- Username/password fields
- Error handling for invalid credentials
- Clean modal design with close button

## 🔌 API Integration

### Endpoint Configuration
The app connects to: `<current_hostname>:8000/chat1`

**Example:**
- If app runs on `http://localhost:3000`, API calls go to `http://localhost:8000/chat1`
- If app runs on `https://example.com`, API calls go to `https://example.com:8000/chat1`

### Request Format
```javascript
FormData {
  message: string,      // User's message text
  select: string,       // "query" | "input" | "data"
  model: string,        // Selected AI model
  operation?: string,   // "get" | "delete" (only for data mode)
  file?: File          // Optional file attachment
}
```

### Response Format

**Query Mode:**
```json
{
  "answer": "Response text here"
}
```

**Input Mode:**
```json
{
  "message": "Response text here"
}
```

The application automatically:
- Removes `(Chunk...)` patterns from responses
- Handles errors gracefully
- Displays appropriate messages for failed requests

## 🔐 Authentication

### Admin Login
- **Username**: `admin`
- **Password**: `admin`
- Status persists in localStorage
- Admin features unlock after login

### User Roles

**Normal User:**
- All messages sent with `select: "query"`
- No mode selection buttons
- Simplified interface

**Admin User:**
- Can choose Query, Input, or Data modes
- Model selection dropdown
- Get/Delete operations in Data mode
- Full feature access

## 🎨 Design Philosophy

The application follows Apple's design principles:
- **Clean & Minimal**: White backgrounds, subtle borders
- **Smooth Interactions**: Transitions and hover effects
- **Consistent Spacing**: Proper padding and margins
- **Readable Typography**: System fonts for native feel
- **Segmented Controls**: Apple-style button groups for mode selection

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Run development server:**
```bash
npm run dev
```

3. **Open browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## ⚙️ Configuration

### Models
Edit `components/ChatInterface.tsx` to add/remove models:
```typescript
const models = [
  'gemini-2.5-flash-preview-05-20',
  'gemma3:12b'
]
```

### API Endpoint
The API endpoint is automatically constructed from the current URL. To change the port or path, modify:
```typescript
// In ChatInterface.tsx
const apiUrl = `${window.location.protocol}//${window.location.hostname}:8000/chat1`
```

### Admin Credentials
To change admin credentials, modify `app/page.tsx`:
```typescript
if (username === 'admin' && password === 'admin') {
  // Change these values
}
```

## 📝 Data Flow

1. **User types message** → `ChatInput` component
2. **User clicks Send** → `handleSubmit` in `ChatInput`
3. **Message passed to** → `ChatInterface.handleSendMessage`
4. **Message added to state** → Displayed immediately in UI
5. **API request sent** → FormData with message, select, model, operation, file
6. **Response received** → Parsed based on mode (answer/message)
7. **Response cleaned** → `(Chunk...)` patterns removed
8. **Response displayed** → Added to message list
9. **Auto-scroll** → Chat scrolls to show new message

## 🔧 Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React Hooks**: State management (useState, useEffect, useRef)
- **localStorage**: Persistent data (admin status, query history, model selection)

## 🚢 Deployment

### Production Build

Build the application for production:

```bash
npm run build
npm start
```

### Important Notes

- **API Endpoint**: The app makes API calls to `<hostname>:/chat1`. Ensure:
  - Your backend API is accessible from the client browser
  - CORS is properly configured on your API server
  - The API server is running on port 8000

## 📄 License

This project is open source and available for use.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Note**: Make sure your backend API is running on port 8000 and handles POST requests to `/chat1` with the specified request format.
