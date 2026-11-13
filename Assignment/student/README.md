# Student Management System - Spring Boot REST API

A robust RESTful API for managing student records built using **Spring Boot**, **Spring Data JPA**, **Hibernate**, and **MySQL**, featuring automatic `.env` credential injection (similar to MERN applications) and centralized exception handling.

---

## 📌 Features

- **Full CRUD Operations**:
  - `POST /api/students` — Register a new student.
  - `GET /api/students` — Retrieve all registered students.
  - `GET /api/students/{id}` — Retrieve a student by ID.
  - `PUT /api/students/{id}` — Update student information.
  - `DELETE /api/students/{id}` — Delete a student by ID.
- **Custom Search / Filtering**:
  - `GET /api/students/course/{course}` — Filter students by course (case-insensitive).
- **Centralized Exception Handling**:
  - `@RestControllerAdvice` global exception handling.
  - Structured `ErrorResponse` (timestamp, status code, error type, and message) on resource not found.
- **Automated Environment Configuration**:
  - Automatic `.env` loading and injection using `dotenv-java` and Spring Boot's `EnvironmentPostProcessor` — zero manual terminal exports required.

---

## 🛠️ Tech Stack

- **Java**: 27
- **Framework**: Spring Boot (Spring Web MVC, Spring Data JPA)
- **ORM / Persistence**: Hibernate ORM, Jakarta Persistence API (JPA)
- **Database**: MySQL 8.x / 9.x (via `mysql-connector-j`)
- **Build Tool**: Maven Wrapper (`./mvnw`)
- **Environment Management**: `dotenv-java` (automatic `.env` loading)
- **Testing**: JUnit 5, Spring Boot Test

---

## 📂 Project Structure

```
student/
├── .env                                  # Local database credentials (gitignored)
├── .env.example                          # Sample environment configuration template
├── pom.xml                               # Maven project descriptor & dependencies
├── README.md                             # Project documentation
├── src/
│   ├── main/
│   │   ├── java/com/example/student/
│   │   │   ├── StudentApplication.java   # Spring Boot entry point
│   │   │   ├── config/
│   │   │   │   └── EnvEnvironmentPostProcessor.java  # Auto .env injector
│   │   │   ├── controller/
│   │   │   │   └── StudentController.java            # REST Controller
│   │   │   ├── entity/
│   │   │   │   └── Student.java                      # JPA Entity
│   │   │   ├── exception/
│   │   │   │   ├── ErrorResponse.java                # Error response model
│   │   │   │   ├── GlobalExceptionHandler.java       # Central exception handler
│   │   │   │   └── ResourceNotFoundException.java    # Custom 404 exception
│   │   │   ├── repository/
│   │   │   │   └── StudentRepository.java            # Spring Data JPA repository
│   │   │   └── service/
│   │   │       ├── StudentService.java               # Service interface
│   │   │       └── impl/StudentServiceImpl.java      # Service implementation
│   │   └── resources/
│   │       ├── application.properties                # Spring application configuration
│   │       └── META-INF/                             # Post-processor SPI registrations
│   └── test/
│       └── java/com/example/student/StudentApplicationTests.java
└── ../postman_screenshots/               # Postman API test proof screenshots
    ├── 01_GET_all_students.png
    ├── 02_GET_student_by_id_2.png
    ├── 03_POST_create_student_vaibhav.png
    ├── 04_PUT_update_student_id_2.png
    ├── 05_DELETE_student_id_3.png
    ├── 06_POST_create_student_navtej.png
    ├── 07_GET_filter_students_by_course_ai.png
    └── 08_GET_filter_students_by_course_cse.png
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- **JDK 17+** (JDK 27 tested)
- **MySQL Server** installed and running on `localhost:3306`

### 2. Database Setup
Create the MySQL database:
```sql
CREATE DATABASE student_management_db;
```

### 3. Environment Configuration
Create or verify the `.env` file in this directory (refer to `.env.example`):
```properties
DB_URL="jdbc:mysql://localhost:3306/student_management_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

> **Automated Injection:** The application automatically reads `.env` on startup via `EnvEnvironmentPostProcessor`. You do not need to manually export variables in your terminal.

---

## 🚀 Running the Application

Make sure you are in this directory (`Assignment/student/`):

### Start the Server
```bash
./mvnw spring-boot:run
```
The server will start on `http://localhost:8080`.

### Run Tests
```bash
./mvnw test
```

### Build Executable JAR
```bash
./mvnw clean package -DskipTests
```
The packaged JAR will be generated in `target/student-0.0.1-SNAPSHOT.jar` and can be run via:
```bash
java -jar target/student-0.0.1-SNAPSHOT.jar
```

---

## 📡 API Endpoints & Documentation

### 1. Create a Student
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/students`
- **Request Body (JSON):**
  ```json
  {
    "name": "vaibhav",
    "email": "vaibhav0123@gmail.com",
    "course": "AI/ML",
    "age": 20
  }
  ```
- **Response Status:** `201 Created`
- **Response Body:**
  ```json
  {
    "id": 3,
    "name": "vaibhav",
    "email": "vaibhav0123@gmail.com",
    "course": "AI/ML",
    "age": 20
  }
  ```

---

### 2. Get All Students
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/students`
- **Response Status:** `200 OK`
- **Response Body:**
  ```json
  [
    {
      "id": 1,
      "name": "gaurav",
      "email": "gm@gmail.com",
      "course": "CSE",
      "age": 19
    },
    {
      "id": 2,
      "name": "ankur",
      "email": "ankur1202@gmail.com",
      "course": "CSE",
      "age": 20
    }
  ]
  ```

---

### 3. Get Student by ID
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/students/{id}`
- **Example:** `GET http://localhost:8080/api/students/2`
- **Response Status:** `200 OK`
- **Response Body:**
  ```json
  {
    "id": 2,
    "name": "ankur",
    "email": "ankur1202@gmail.com",
    "course": "CSE",
    "age": 20
  }
  ```
- **If Not Found (e.g. ID 999):** `404 Not Found`
  ```json
  {
    "timestamp": "2026-11-13T21:01:13.228151",
    "status": 404,
    "error": "Not Found",
    "message": "Student not found with id: 999"
  }
  ```

---

### 4. Update Student
- **Method:** `PUT`
- **URL:** `http://localhost:8080/api/students/{id}`
- **Example:** `PUT http://localhost:8080/api/students/2`
- **Request Body (JSON):**
  ```json
  {
    "name": "ankur",
    "email": "ankur1234@gmail.com",
    "course": "CSE",
    "age": 20
  }
  ```
- **Response Status:** `200 OK`
- **Response Body:**
  ```json
  {
    "id": 2,
    "name": "ankur",
    "email": "ankur1234@gmail.com",
    "course": "CSE",
    "age": 20
  }
  ```

---

### 5. Delete Student
- **Method:** `DELETE`
- **URL:** `http://localhost:8080/api/students/{id}`
- **Example:** `DELETE http://localhost:8080/api/students/3`
- **Response Status:** `200 OK`
- **Response Body:**
  ```
  Student deleted successfully with id: 3
  ```

---

### 6. Filter Students by Course
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/students/course/{course}`
- **Example:** `GET http://localhost:8080/api/students/course/ai`
- **Response Status:** `200 OK`
- **Response Body:**
  ```json
  [
    {
      "id": 4,
      "name": "navtej",
      "email": "nav@gmail.com",
      "course": "AI",
      "age": 20
    }
  ]
  ```

---

## 📸 Postman Test Screenshots

All API endpoints have been tested in Postman and are documented in [../postman_screenshots/](../postman_screenshots/):

| Step | Screenshot File | Method & Route | Description |
| :---: | :--- | :--- | :--- |
| 1 | `01_GET_all_students.png` | `GET /api/students` | Retrieve list of all existing students |
| 2 | `02_GET_student_by_id_2.png` | `GET /api/students/2` | Retrieve details for student ID 2 |
| 3 | `03_POST_create_student_vaibhav.png` | `POST /api/students` | Add new student (vaibhav) with HTTP 201 |
| 4 | `04_PUT_update_student_id_2.png` | `PUT /api/students/2` | Update student ID 2 details (new email) |
| 5 | `05_DELETE_student_id_3.png` | `DELETE /api/students/3` | Delete student ID 3 from database |
| 6 | `06_POST_create_student_navtej.png` | `POST /api/students` | Add another student (navtej, course AI) |
| 7 | `07_GET_filter_students_by_course_ai.png` | `GET /api/students/course/ai` | Case-insensitive filter for AI students |
| 8 | `08_GET_filter_students_by_course_cse.png` | `GET /api/students/course/cse` | Filter for CSE students (returns multiple) |
