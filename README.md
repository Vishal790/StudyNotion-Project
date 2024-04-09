# StudyNotion

## Introduction

StudyNotion aims to provide a seamless and interactive learning experience for students, making education more accessible and engaging. Additionally, the platform serves as a hub for instructors to showcase their expertise and connect with learners worldwide.

In the following sections, we will cover the technical details of the platform, including the system architecture, API design, installation, usage instructions, and potential future enhancements.

## System Architecture

The StudyNotion EdTech platform comprises three main components: the front-end, the back-end, and the database. The platform follows a client-server architecture, with the front-end serving as the client and the back-end and database serving as the server.

## Front-end

The front-end of the platform is built using ReactJS, enabling the creation of dynamic and responsive user interfaces crucial for providing an engaging learning experience. The front-end communicates with the back-end using RESTful API calls.

### Front End Pages

For Students:

- Homepage: A brief introduction to the platform with links to the course list and user details.
- Course List: A list of all available courses, along with their descriptions and ratings.
- Wishlist: Displays courses added to the student's wishlist.
- Cart Checkout: Allows users to complete course purchases.
- Course Content: Presents course content, including videos and related materials.
- User Details: Provides account details such as name, email, etc.
- User Edit Details: Allows students to edit their account details.

For Instructors:

- Dashboard: Offers an overview of the instructor's courses, along with ratings and feedback.
- Insights: Provides detailed insights into course performance.
- Course Management Pages: Enables instructors to create, update, and delete courses, and manage content and pricing.
- View and Edit Profile Details: Allows instructors to manage their account details.

### Front-end Tools and Libraries

To build the front-end, we use frameworks and libraries such as ReactJS, CSS, and Tailwind for styling, and Redux for state management.

## Back-end

The back-end of the platform is built using NodeJS and ExpressJS, providing APIs for the front-end to consume. These APIs include functionalities such as user authentication, course management, and payment integration. The back-end also handles processing and storing course content and user data.

### Back-end Features

- User Authentication and Authorization
- Course Management
- Payment Integration
- Cloud-based Media Management

### Back-end Frameworks, Libraries, and Tools

The back-end of StudyNotion uses various frameworks, libraries, and tools to ensure functionality and performance.

## Database

The database for the platform is built using MongoDB, providing a flexible and scalable data storage solution. MongoDB allows storage of unstructured and semi-structured data, including course content, user data, and related information.

## Architecture Diagram

![image](https://github.com/Vishal790/StudyNotion-Project/assets/109164581/bd66d315-4fd3-4894-ac9a-a1a104b202e8)


## API Design

The StudyNotion platform's API is designed following the REST architectural style. It is implemented using Node.js and Express.js, using JSON for data exchange and standard HTTP request methods such as GET, POST, PUT, and DELETE.


## Installation

1. Clone the repository: `git clone`
2. Navigate to the project directory: `cd StudyNotion`
3. Install dependencies: `npm install`

## Configuration

1. Set up a MongoDB database and obtain the connection URL.
2. Create a `.env` file in the root directory with the following environment variables:
MONGODB_URI=<your-mongodb-connection-url>
JWT_SECRET=<your-jwt-secret-key>


## Usage

1. Start the server: `npm run dev`
2. Open a new terminal and navigate to the client directory: `cd client`
3. Start the React development server: `npm run dev`
4. Access the application in your browser at [http://localhost:3000](http://localhost:3000).

Happy Learning! 📚✨
