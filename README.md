# HarmonyHub

Senior Design Project

## Tech Stack

- Framework: Next.js and FastAPI
- Database: PostgreSQL, Prisma ORM, and Better Auth
- UI/Styling: Tailwind CSS and shadcn
- Testing: Jest and PlayWright
- Code Quality: ESLint, Prettier, and TypeScript
- Local Dev Environment: Docker
- Hosting: Vercel (website) and Neon (database)

Note: Some of this information with specific version numbers can be found in [`package.json`](package.json).

## Project Structure

```text
app/            # Next.js app router
└─ api/         # Where request handlers are nested (Next.js route.ts files)
components/     # Reusable UI components
└─ ui/          # Basic component building blocks
docs/           # Documentation related files
hooks/          # Reusable custom react hooks
lib/            # Utility functions
public/         # Static files/assets
services/       # For backend related functions (e.g. API and database)
tests/          # Where tests are stored
├─ e2e/         # Playwright end-to-end test files
└─ unit/        # Jest unit test files
.env.example    # Showcase of important environment variables
components.json # Config file for shadcn
envConfig.ts    # For loading environment variables outside Next.js
jest.setup.ts   # Set up code run before every Jest test and mocks
middleware.ts   # Next.js Middleware
```

## Development Environment

### Prerequisites

- Node (v24 recommended)
- npm
- Docker
- Python
- Visual Studio Code

### First Time Set Up

1\. It's recommended to start by opening the project in Visual Studio Code and downloading the Visual Studio Code extensions recommended by our workspace (should prompt you, but extensions can be found in [`.vscode/extensions.json`](.vscode/extensions.json) if not).

2\. Install the apps node dependencies, then generate the needed TypeScript types.

```PowerShell
npm install
npx prisma generate
npx next typegen
```

3\. Create and activate a Python virtual environment, then download the required Python packages.

```PowerShell
python3 -m venv .venv
.venv\Scripts\activate 
pip3 install -r requirements.txt
```

***Note:** The command to active the virtual environment differs depending on your OS and shell. See [the Python docs](https://docs.python.org/3/library/venv.html#how-venvs-work) for your platforms specific command.*

4\. Create a local copy of `.env.example` renamed to `.env` in the root directory of the project.

5\. In your new `.env` file, fill the empty values from `.env.example` with our secret ones.

***Note:** Set `YTMUSIC_API_BASE_URL` in your `.env` if your YouTube FastAPI service runs somewhere other than `http://127.0.0.1:8000`.*

6\. Run the command `docker compose up -d db` to start a local PostgresSQL database.

7\. If desired, run `npx prisma db seed` to fill your local database with test data.

8\. Run `npm run dev` to start the app in development mode.

***Note:** `npm run dev` and `npm start` both run the Next.js app and the local FastAPI YouTube service.*

9\. Open the app by going to `127.0.0.1:3000` in your browser.

## Troubleshooting

### Type Issues

If you are getting type errors, make sure to run `npm install`, `npx next typegen`, and `npx prisma generate` to ensure all the necessary types have been created.

## Architecture Diagram

![HarmonyHub Architecture](docs/HarmonyHub_Architecture.png)

## Project Plan Links

GitHub Projects: <https://github.com/users/suprads/projects/2>

OneDrive: <https://mailuc.sharepoint.com/:f:/r/sites/SeniorDesign2526-Prof.Dekok-Group52/Shared%20Documents/Group%2052%20-%20Harmony%20Hub?csf=1&web=1&e=WZB0To>
