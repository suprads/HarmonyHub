# HarmonyHub

Senior Design Project

## Tech Stack

- Framework: Next.js
- Database: PostgreSQL, Prisma ORM, and Neon for database hosting
- Testing: Jest and PlayWright
- Code Quality: ESLint, Prettier, and TypeScript
- Local Dev Environment: Docker

Note: Some of this information with specific version numbers can be found in [`package.json`](package.json).

## Project Structure

```text
app          # Next.js app router
└─ api       # Where request handlers are nested (Next.js route.ts files)
components   # Reusable UI components
hooks        # Reusable custom react hooks
lib          # Utility functions
public       # Static files/assets
services     # For backend related functions (e.g. API and database)
tests        # Where tests are stored
.env.example # Showcase of important environment variables
```

## Development Environment

### Prerequisites

- node (v24 recommended)
- npm
- docker
- Visual Studio Code

### General Set Up

1. Clone the project to a local directory.
2. Open the project in Visual Studio Code.
3. Download the Visual Studio Code extensions recommended by our workspace (should prompt you, but extensions can be found in [`.vscode/extensions.json`](.vscode/extensions.json) if not).
4. Run `npm install`.
5. Create a file called `.env` in the root directory of the project.
6. Run `npm run dev` to start the app.
7. Open the app by going to `localhost:3000`.

### Database Set Up

1. Use the exact `POSTGRES*` and `DATABASE_URL` environment variables from `.env.example` in your `.env` file.
2. Run the command `npx prisma generate`.
3. Run the command `docker compose up db` to start a local PostgresSQL database.

Note: To use the actual production database hosted by Neon, set the `POSTGRES*` variables and the `DATABASE_URL` to our secret values.

### API

Ask team members what values `SPOTIFY_CLIENT_SECRET` and `SPOTIFY_CLIENT_ID` should be assigned in your `.env` file, as the correct values are needed to connect to the API.

### Type Issues

If you are getting type errors, make sure to run `npm install`, `npx next typegen`, and `npx prisma generate` to ensure all the necessary types have been created.

## Project Plan Links

GitHub Projects: <https://github.com/users/suprads/projects/2>

OneDrive: <https://mailuc.sharepoint.com/:f:/r/sites/SeniorDesign2526-Prof.Dekok-Group52/Shared%20Documents/Group%2052%20-%20Harmony%20Hub?csf=1&web=1&e=WZB0To>
