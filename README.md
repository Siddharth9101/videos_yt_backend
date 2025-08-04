# Videotube, a Video Sharing Platform (Node.js + Express.js + Cloudinary + MongoDB)

Videotube is a full-featured video-sharing platform built with Node.js and MongoDB. It allows users to upload, watch, like, and comment on videos, manage playlists, follow channels, and interact through tweets — similar to YouTube, but built for educational and portfolio purposes.

## 🔧 Features

```
🔐 User Registration & Login
🔁 Change Password
📜 Watch History Tracking
📁 Create & Manage Playlists
🔔 Subscribe / Unsubscribe to Channels
🎙️ Create & Maintain Personal Channels
🐦 Integrated Tweet Section
💬 Comment on Videos
❤️ Like Videos, Tweets & Comments
⬆️ Upload Videos & Thumbnails
```

## 🛠️ Tech Stack

- **Backend Framework:** Express.js
- **Database:** MongoDB
- **Images and Video Storage:** Cloudinary
- **Deployment:** Render

## 🗃️ API Endpoints

### 🔐 Auth & User

| Method | Endpoint                       | Description                     |
| ------ | ------------------------------ | ------------------------------- |
| POST   | `/api/users/register`          | Register a new user             |
| POST   | `/api/users/login`             | User login                      |
| POST   | `/api/users/logout`            | User logout                     |
| POST   | `/api/users/change-password`   | Change user password            |
| GET    | `/api/users/access-token`      | Refresh access token            |
| GET    | `/api/users/current-user`      | Get current user info           |
| GET    | `/api/users/channel/:username` | Get channel details by username |
| PATCH  | `/api/users/profile`           | Update user profile             |
| PATCH  | `/api/users/avatar`            | Update user avatar              |
| PATCH  | `/api/users/coverImage`        | Update user cover image         |

### 📺 Videos

| Method | Endpoint                              | Description           |
| ------ | ------------------------------------- | --------------------- |
| GET    | `/api/videos`                         | Get all videos        |
| POST   | `/api/videos`                         | Publish a new video   |
| GET    | `/api/videos/:videoId`                | Get video by ID       |
| PATCH  | `/api/videos/:videoId`                | Update video by ID    |
| DELETE | `/api/videos/:videoId`                | Delete video by ID    |
| PATCH  | `/api/videos/toggle/publish/:videoId` | Toggle publish status |

### 💬 Comments

| Method | Endpoint                                 | Description                 |
| ------ | ---------------------------------------- | --------------------------- |
| GET    | `/api/comments/:videoId?page=1&limit=10` | Get all comments on a video |
| POST   | `/api/comments/:videoId`                 | Add a comment on a video    |
| PUT    | `/api/comments/c/:commentId`             | Update a comment            |
| DELETE | `/api/comments/c/:commentId`             | Delete a comment            |

### ❤️ Likes

| Method | Endpoint                         | Description              |
| ------ | -------------------------------- | ------------------------ |
| POST   | `/api/likes/toggle/v/:videoId`   | Toggle like on a video   |
| POST   | `/api/likes/toggle/c/:commentId` | Toggle like on a comment |
| POST   | `/api/likes/toggle/t/:tweetId`   | Toggle like on a tweet   |
| GET    | `/api/likes/videos`              | Get all liked videos     |

### 📁 Playlists

| Method | Endpoint                                     | Description                  |
| ------ | -------------------------------------------- | ---------------------------- |
| POST   | `/api/playlists`                             | Create a new playlist        |
| GET    | `/api/playlists/:playlistId`                 | Get playlist by ID           |
| GET    | `/api/playlists/user/:userId`                | Get playlists of a user      |
| PATCH  | `/api/playlists/:playlistId`                 | Update a playlist            |
| DELETE | `/api/playlists/:playlistId`                 | Delete a playlist            |
| PATCH  | `/api/playlists/add/:videoId/:playlistId`    | Add a video to playlist      |
| PATCH  | `/api/playlists/remove/:videoId/:playlistId` | Remove a video from playlist |

### 🧑‍🤝‍🧑 Subscriptions

| Method | Endpoint                          | Description                   |
| ------ | --------------------------------- | ----------------------------- |
| GET    | `/api/channels/c/:channelId`      | Get channel’s subscribers     |
| POST   | `/api/subscriptions/c/:channelId` | Toggle subscribe to a channel |
| GET    | `/api/channels/u/:subscriberId`   | Get subscribed channels       |

### 🐦 Tweets

| Method | Endpoint                   | Description           |
| ------ | -------------------------- | --------------------- |
| POST   | `/api/tweets`              | Create a tweet        |
| GET    | `/api/tweets/user/:userId` | Get tweets by user ID |
| PATCH  | `/api/tweets/:tweetId`     | Update a tweet        |
| DELETE | `/api/tweets/:tweetId`     | Delete a tweet        |


### 📊 Dashboard

| Method | Endpoint                | Description                |
| ------ | ----------------------- | -------------------------- |
| GET    | `/api/dashboard/stats`  | Get user stats             |
| GET    | `/api/dashboard/videos` | Get all videos by the user |

### 📜 Watch History

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| GET    | `/api/users/history` | Get user’s watch history |

### 🧪 Healthcheck

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| GET    | `/api/healthcheck` | Server health check |


## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Siddharth9101/videos_yt_backend.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Copy .env.sample and create your own .env file

```bash
cp .env.sample .env
```

### 4. Run the server
```bash
npm run dev
```
 
🔗 [Live Demo](https://your-deployed-url.com)


📬 Postman collection available on request


## 📁 Project Structure

```
videotube-backend/
├── public/                     # Static assets
├── src/                        # Source code
│   ├── controllers/            # Route handlers
│   ├── db/                     # Database connection/config
│   ├── middlewares/            # Express middleware functions
│   ├── models/                 # Mongoose models
│   ├── routes/                 # API route definitions
│   ├── schemas/                # Validation schemas (Zod)
│   ├── utils/                  # Utility/helper functions
│   ├── app.js                  # Express app configuration
│   ├── constants.js            # Global constants
│   └── index.js                # Entry point (starts server)
├── .env                        # Environment variables
├── .env.sample                 # Sample env file
├── .gitignore                  # Git ignored files
├── .prettierrc                 # Prettier configuration
├── .prettierignore             # Prettier ignore patterns
├── package.json                # Project metadata and scripts
├── package-lock.json           # Dependency lock file
└── README.md                   # Project documentation
```

## 📝 License

This project is licensed under the MIT License.