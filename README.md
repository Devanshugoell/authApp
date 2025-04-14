# React.js Authentication Integration

This project is a React.js frontend that integrates with a provided Authentication API for login, token management, and session handling. The app allows users to log in using their credentials, maintain their session with access tokens, and refresh expired tokens automatically. Additionally, it provides a logout functionality that clears the session and invalidates the token.

## Prerequisites

To run the project locally, you need to have the following software installed:

Node.js (v14.x or higher)

npm (Node package manager)

## Installation

## Clone the repository

git clone https://github.com/Devanshugoell/authApp.git
**cd react-auth-integration**

## Install dependencies: In the project directory, run:

npm install

## Start the development server: Run the following command:

npm start

This will start the app in development mode. Open http://localhost:3000 to view it in the browser.

## Features

Login Page: Users can log in with the provided credentials.

Token Management: The app automatically stores access tokens in local storage and refresh tokens in cookies.

Session Handling: The access token is automatically refreshed when expired.

Logout: Users can log out, which invalidates the session and clears the tokens.

Added Protect routes using React router DOM

Storing access Token , Refresh Token , user in local Storage

## Dependencies:

Make sure you are using the following dependencies in your package.json:
"dependencies": {
"axios": "^1.8.4",
"react": "^18.2.0",
"react-dom": "^18.2.0",
"react-router-dom": "^6.17.0"
}
