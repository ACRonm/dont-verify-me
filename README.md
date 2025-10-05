# Dont Verify Me - Privacy Protection Platform

Dont Verify Me is a platform that collates ways to bypass Australian social media age verification to maintain privacy.

## Core Features

- **Privacy Resources:** Curated collection of methods and tools to maintain online privacy
- **Age Verification Bypass:** Documentation of legitimate ways to protect your identity online
- **Privacy Education:** Learn about your digital rights and privacy protection strategies
- **Community-Driven:** Contribute to and benefit from community-sourced privacy protection methods

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Project Architecture](#project-architecture)
- [Troubleshooting](#troubleshooting)
- [Screenshots/Demos](#screenshotsdemos)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/ACRonm/dont-verify-me.git
    ```

2.  Install the dependencies:

    ```bash
    npm install
    ```

3.  Run the development server:

    ```bash
    npm run dev:web
    ```

## Development Workflow

### Running Tests

To run the test suite, use the following command:

```bash
npm test
```

## API Documentation

This project uses [Supabase](https://supabase.io/) for its backend. The API logic is handled on the client-side or through serverless functions.

## Deployment

The web app is deployed on [Vercel](https://vercel.com/).

## Contributing

Contributions are welcome! Please open an issue to discuss your ideas or submit a pull request.

### Reporting Bugs

Please open an issue and include as much detail as possible, including steps to reproduce the bug.

### Suggesting Features

Please open an issue and describe the feature you would like to see.

### Submitting Pull Requests

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a pull request.

## Project Architecture

This project is a monorepo with the following structure:

- `apps`: Contains the web and mobile applications.
- `packages`: Contains shared packages, such as UI components and logic.

### Database Schema

The database is hosted on [Supabase](https://supabase.io/) and uses PostgreSQL. The schema includes tables for `users`, `motorcycles`, and `tire_sets`.

### UI Component Library

The UI is built with [Tamagui](https://tamagui.dev/), a cross-platform UI toolkit for React Native and Web.

## Troubleshooting

- **Problem:** The app is not running after `npm run dev:web`.
- **Solution:** Make sure you have Node.js v18 or higher installed. You can check your Node.js version with `node -v`.

## Screenshots/Demos

_Coming soon..._
