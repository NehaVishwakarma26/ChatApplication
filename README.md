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
