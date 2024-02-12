# NestJS Prisma Startup Platform

## Description
This project is a web-based platform built with NestJS and Prisma that facilitates the interaction of startups and investors. It provides features for startup registration, authentication, and authorization, as well as protected routes for registered startups to access specific data.

## Installation
1. **Clone the repository:**
    ```bash
    git clone https://github.com/Dagmawi-Y/startgood.git
    ```

2. **Install dependencies:**
    ```bash
    cd startgood
    npm install
    ```

3. **Set up the PostgreSQL database and configure the connection URL in the `.env` file.**

4. **Run database migrations:**
    ```bash
    npx prisma migrate save --name init
    npx prisma migrate up --experimental
    ```

5. **Start the server:**
    ```bash
    npm run start:dev
    ```

## Usage
- Register startups using the provided registration endpoint.
- Authenticate startups using JWT tokens.
- Access protected routes for registered startups to retrieve specific data.

## Endpoints
<!-- - `POST /auth/register`: Register a new startup.
- `POST /auth/login`: Log in and generate JWT token for authentication.
- `GET /startups/protected-route`: Access protected route for registered startups. -->

## Contributing
Contributions are welcome! Please follow these steps to contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
