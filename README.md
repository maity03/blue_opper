# Blue C Bug Tracker with AI Tag Generation

A comprehensive bug tracking system with AI-powered tag generation using OpenRouter API.

## Features

- **User Authentication**: Secure login and registration system
- **Bug Management**: Create, edit, delete, and track bugs
- **AI Tag Generation**: Automatic tag generation for bugs using OpenRouter API
- **Tag Filtering**: Filter bugs by AI-generated tags
- **Status Management**: Track bug status (Open, In Progress, Resolved, Closed)
- **Severity Levels**: Categorize bugs by severity (Low, Medium, High, Critical)
- **User Assignment**: Assign bugs to team members
- **Real-time Updates**: Dynamic UI updates with tag regeneration

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- OpenRouter API for AI tag generation
- Axios for HTTP requests

### Frontend
- React with Vite
- Tailwind CSS for styling
- Context API for state management

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- OpenRouter API key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/bug_tracker
   JWT_SECRET=your_jwt_secret_key_here
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   PORT=5000
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Bugs
- `GET /api/bugs` - Get all bugs (with filtering)
- `GET /api/bugs/:id` - Get single bug
- `POST /api/bugs` - Create new bug (with AI tag generation)
- `PUT /api/bugs/:id` - Update bug (regenerates tags if title/description changes)
- `DELETE /api/bugs/:id` - Delete bug
- `GET /api/bugs/tags` - Get all unique tags
- `POST /api/bugs/:id/regenerate-tags` - Regenerate tags for a specific bug
- `GET /api/bugs/users` - Get all users for assignment
- `GET /api/bugs/stats` - Get bug statistics

## Tag Generation

The system automatically generates relevant tags for each bug using the OpenRouter API. Tags are generated based on:

- **Technology/Component**: frontend, database, API, UI, authentication
- **Issue Type**: crash, performance, security, usability, data-loss
- **Feature Areas**: login, search, payment, reporting

### Tag Generation Process

1. When a bug is created, the system sends the title and description to OpenRouter API
2. The AI analyzes the content and generates 3-5 relevant tags
3. Tags are stored in the database and displayed in the UI
4. Users can regenerate tags for existing bugs using the 🔄 button
5. Tags can be used for filtering and searching bugs

### Filtering by Tags

- Use the Tags dropdown in the filter section to filter bugs by specific tags
- Multiple tags can be selected for more precise filtering
- Tags are displayed as colored badges in the bug list

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `OPENROUTER_API_KEY` | API key for OpenRouter service | Yes |
| `PORT` | Server port (default: 5000) | No |
| `NODE_ENV` | Environment (development/production) | No |

## Getting OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up for an account
3. Navigate to your API keys section
4. Create a new API key
5. Add the key to your `.env` file

## Usage

1. Register a new account or login
2. Create a new bug report with title and description
3. The system will automatically generate relevant tags
4. Use the tag filter to find specific types of bugs
5. Regenerate tags if needed using the 🔄 button
6. Assign bugs to team members and track their status

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 