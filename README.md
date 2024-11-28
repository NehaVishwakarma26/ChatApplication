# Chat Application

This is a real-time chat application designed for seamless communication between users. It includes user authentication, real-time messaging, typing indicators, and user presence indicators. It is built with React for the frontend, Node.js with Express for the backend, and MongoDB for the database, making it a fully functional and scalable messaging platform.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

### User Authentication
- **Sign Up & Login**: Secure user authentication with JWT-based token validation for login and sign-up.
- **Protected Routes**: Routes that require authentication to access certain resources (like messaging) are protected using middleware that checks for the presence of a valid token.

### Real-Time Messaging
- **WebSockets**: This application uses Socket.io to enable real-time communication between users. Messages are delivered instantly across the network.
- **Message History**: Messages are stored in the MongoDB database and can be retrieved whenever a user starts a chat, preserving the conversation history.

### User Presence Indicators
- **Online Status**: A user's status is indicated as "online" when they are connected to the WebSocket server.
- **Typing Indicator**: When a user is typing, others in the conversation will see a “typing...” indicator, providing a real-time experience.

### Typing Indicator
- **Instant Typing Feedback**: The application listens for changes in the input field and notifies others when someone is typing. Once the typing stops for a brief moment, the status automatically updates to "stop typing."

## Tech Stack
- **Frontend**: React.js – The frontend of the application is built using React, which allows for a responsive and dynamic user interface.
- **Backend**: Node.js with Express – The backend server is built with Node.js and Express, which handle API requests, user authentication, and real-time WebSocket communication.
- **Database**: MongoDB – A NoSQL database used for storing user data, chat messages, and other necessary application data.
- **WebSockets**: Socket.io – A library that enables real-time, bidirectional communication between the frontend and backend, allowing for instant message delivery and notifications.

## Installation

### Clone the Repository
```bash
git clone https://github.com/your-username/chat-application.git
cd chat-application

## Backend Setup

### Install Backend Dependencies

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the `server` folder to configure the application. Example:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your_jwt_secret
```

### Run the Backend

To start the backend server on port 5000 (or any port you've configured), run the following command:

```bash
npm start
```

---

## Frontend Setup

### Install Frontend Dependencies

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

### Run the Frontend

To start the frontend application, run the following command:

```bash
npm start
```

This will run the frontend on [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

### Backend Environment Variables:
- **PORT**: The port on which the backend server will run (default: `5000`).
- **MONGODB_URI**: The URI to connect to your MongoDB database.
- **JWT_SECRET**: A secret key used for signing and verifying JSON Web Tokens.

### Frontend Environment Variables:
- **REACT_APP_API_URL**: The URL to the backend API (usually `http://localhost:5000` in development).

---

## Usage

### User Authentication

Users can sign up and log in through the frontend interface. The authentication process is handled by the backend, which returns a JWT token upon successful login. The token is stored in `localStorage` or `sessionStorage` on the frontend and used to authenticate subsequent requests.

### Chat Interface

After logging in, users can select a contact from the sidebar to start a conversation. Once a user selects a contact, the chat area updates to display the conversation history. 

- **Real-time Messaging**: New messages are sent and received instantly using Socket.io.

---

## Contributing

We welcome contributions to this project! If you'd like to contribute, please follow these steps:

### Steps to Contribute:
1. **Fork the repository**: Create a copy of the repository on your GitHub account.
2. **Create a new branch**: Make a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-or-bugfix-name
   ```
3. **Make your changes**: Modify the code, add new features, or fix bugs.
4. **Commit your changes**: 
   ```bash
   git commit -m "Description of your changes"
   ```
5. **Push to your fork**:
   ```bash
   git push origin feature-or-bugfix-name
   ```
6. **Open a pull request**: Open a pull request on the original repository with a description of your changes.

### Guidelines:
- Ensure the code is well-documented and follows a consistent style.
- Write tests for any new features or bug fixes.
- If fixing a bug, describe how you reproduced it and how your fix resolves it.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
