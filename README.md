# ✨ Impostor 🚀

Welcome to the **Impostor**!
This project was generated using a **custom cookiecutter template** and provides a **full-stack setup** with **React Frontend (Vite)**, **Spring Boot Backend**, and a **PostgreSQL Database**. 🖥️⚙️🗄️

## 🗂️ Project Structure

- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React Logo" width="25" height="25"/> **Frontend:** React (Vite) app in `frontend/`
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" alt="Spring Boot Logo" width="25" height="25"/> **Backend:** Spring Boot app in `backend/`
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL Logo" width="25" height="25"/> **Database:** PostgreSQL scripts in `backend/src/main/resources/db/`
- <img src="https://playwright.dev/img/playwright-logo.svg" alt="Playwright Logo" width="25" height="25"/> **Testing:** Playwright tests in `frontend/test/`

## 🚀 Getting Started

### 1️⃣ Setup `asdf` Version Manager

👉 Getting started with [asdf](https://asdf-vm.com/guide/getting-started.html)

Run the following commands in your project root to download the required dependencies:

```sh
# Installing nodejs plugin...
asdf plugin add nodejs
# Installing java plugin...
asdf plugin add java
# Install all the package versions listed in the .tool-versions file
asdf install
```

### 2️⃣ Create the React Frontend

Navigate to the `frontend/` directory and create a new React app using Vite:

```sh
cd frontend
npm create vite@latest . -- --template react-swc-ts
npm install
```

### 3️⃣ Create the Spring Boot Backend

Use the [Spring Initializr](https://start.spring.io/) to generate a new Spring Boot project. Choose the following options:

- 📦 Project: Gradle
- ☕ Language: Java
- 🌱 Spring Boot version: latest stable
- 🏷️ Group: `com.impostor`
- 📛 Artifact: `impostor`
- 🚀 Name: `ImpostorApplication`
- 🔌 Dependencies: Lombok, Spring Data JPA, Flyway Migration, Rest Repositories, PostgreSQL Driver, etc.

Download and extract the project into the `backend/` directory.

### 4️⃣ Set Up the Database

1. ✍️ Adjust the SQL scripts in `backend/src/main/resources/db/setup/` to create tables, constraints, indexes, and comments.
1. 🧪 Add test data to `backend/src/main/resources/db/testdata/`.
1. ▶️ Start the database with `make db-start`.
1. 🔄 Run the database migration with `make flyway-migrate`.

### 5️⃣ Generate Entities in IntelliJ

1. Configure the PostgreSQL dabase in IntelliJ using the following entries:

   - database name: `impostor`
   - database port: `16545`
   - database schema: `impostor`

1. In IntelliJ IDEA, use the JPA/Hibernate tools to [generate entity classes from the running database schema](https://www.jetbrains.com/help/idea/jpa-buddy-reverse-engineering.html).

### 6️⃣ Implement Backend Logic

1. 📦 Create DTOs (Data Transfer Objects) for API communication.
1. 🧩 Implement Controllers, Repositories, and Services for your business logic.
1. 🗄️ Use Spring Data JPA for database access.
1. 🧪 Add unit and integration tests for backend services and repositories.

### 7️⃣ Write Playwright API Tests for the Backend

1. In the `frontend/` directory, set up Playwright:
   ```sh
   npm install -D @playwright/test
   npx playwright install
   ```
1. Create API tests in `frontend/` (or a dedicated `test/` folder) to verify backend endpoints.
1. Use Playwright's test runner for assertions and test reporting.

### 8️⃣ Implement the React Frontend

1. Build out the UI in `frontend/src/` using React and TypeScript.
1. Connect to the backend API using fetch/axios.
1. Use `vite.config.ts` to configure a proxy for `/api` calls to the backend URL (default: `http://localhost:9769`).

### 9️⃣ Write Playwright E2E Tests for the Frontend

1. Add E2E tests in `frontend/` using Playwright to simulate user interactions and verify the full stack.

## 💡Additional Recommendations

1. 🔄 Set up CI/CD pipelines in `.github/workflows/impostor.yml` for automated testing and deployment.
1. 📖 Generate and document your API using [OpenAPI](https://www.openapis.org/)/[Swagger](https://swagger.io/).
1. 🔁 Use [MapStruct](https://mapstruct.org/) to generate mappings between Java bean types
1. 🧹 Add code quality tools (ESLint, Prettier, Checkstyle, etc.).
1. 🔒 Consider security: authentication (JWT/OAuth), and input validation.

## 📬 Contact

- 👨‍💻 **Author:** Mael Seewald
- 📧 **Email:** maelseewald@gmx.net
