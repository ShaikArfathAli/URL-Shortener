# URL Shortener

This project provides a simple URL shortener service. It allows users to create short URLs, view all shortened URLs, and access a dashboard that displays shortened links along with their click counts. The system is built using Node.js with Express and MySQL for data storage.

## Features

- **Create Short URL**: Users can input a long URL, and the system generates a short URL.
- **View All Shortened URLs**: Displays a list of all shortened URLs along with their click counts.
- **Redirect**: When a user accesses a shortened URL, they are redirected to the original long URL.
- **Clear All URLs**: Admin can clear all shortened URLs from the database.
- **Delete a URL**: Admin can delete a specific shortened URL by its ID.
- **Dark/Light Theme**: Toggle between dark and light themes for the interface.

## Tech Used

- **HTML**: For the basic structure of the web pages.
- **CSS**: For styling the front end and making the interface responsive.
- **JavaScript**: For the front-end logic and interaction.
- **Node.js**: A JavaScript runtime used to run the backend logic.
- **Express.js**: A web framework for Node.js used to handle routing and API requests.
- **MySQL**: A relational database to store URLs and their associated data.

## Prerequisites

Before you run this project locally, make sure you have the following installed:

- **Node.js**: A JavaScript runtime. You can install it from [here](https://nodejs.org/).
- **MySQL**: A relational database to store URLs and their associated data. Install it from [here](https://www.mysql.com/).
