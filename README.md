Sweet Shop Management System
Welcome to the Sweet Shop Management System! This is a full-stack application designed to manage a sweet shop's inventory, sales, and user interactions. The project is built following a Test-Driven Development (TDD) approach and showcases modern development practices.

Project Overview
This application consists of a backend API and a frontend single-page application (SPA). The backend handles data management and business logic, while the frontend provides a user-friendly interface for interacting with the system.

Backend: A robust RESTful API built with Spring Boot and Java. It uses MySQL as the database to store and manage sweet inventory and user data.

Frontend: A modern SPA developed with React. It consumes the backend API to provide a seamless user experience, including a dashboard for viewing sweets and forms for user authentication and admin functionalities.

Features
Backend
User Authentication: Secure registration and login using JWT (JSON Web Tokens).

Sweet Management (Protected):

Add, view, update, and delete sweets.

Search sweets by name, category, or price range.

Inventory Management (Protected):

Purchase sweets (decreases quantity).

Restock sweets (increases quantity, Admin only).

Frontend
User Interface: Intuitive and responsive design.

Authentication: User registration and login forms.

Sweet Display: A dashboard to view all available sweets.

Search & Filter: Functionality to easily find sweets.

Purchase: A "Purchase" button on each sweet item, disabled when the quantity is zero.

Admin Dashboard: Dedicated UI for adding, updating, and deleting sweets.

How to Run the Project Locally
Prerequisites
Java Development Kit (JDK) 17 or higher

Node.js 14 or higher

npm or yarn

MySQL database running locally or on a server.
git clone :https://github.com/technical-programmer/SweetRush.git
cd your-repo/backend
Configure the database:

Create a new MySQL database (e.g., sweet_shop_db).

Update the src/main/resources/application.properties file with your MySQL credentials:
spring.datasource.url=jdbc:mysql://localhost:3306/sweet_shop_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=your-mysql-username
spring.datasource.password=your-mysql-password
spring.jpa.hibernate.ddl-auto=update


<img width="1896" height="883" alt="image" src="https://github.com/user-attachments/assets/fc2b664a-4c75-40cb-ac6d-c8dbf6304596" />
 admin :
<img width="1899" height="939" alt="image" src="https://github.com/user-attachments/assets/8d8175dc-e2da-48fa-b740-75da9294c620" />
user :
<img width="1874" height="959" alt="image" src="https://github.com/user-attachments/assets/718d6050-090c-4894-a8a4-4d98714b2f0b" />




I extensively leveraged AI tools throughout this project to streamline my workflow, accelerate development, and enhance the quality of the final product.The primary tools I used is Gemini and the main part where i used ai was when working on the authentication part




