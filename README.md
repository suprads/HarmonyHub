# HarmonyHub

Senior Design Project

## Development Environment Set Up

Create a file called `.env` in the root directory of the project.

If you are getting type errors, make sure to run `npx next typegen` and `npx prisma generate` to ensure all the necessary types have been generated.

### Database Set Up

1. Use the exact `POSTGRES*` and `DATABASE_URL` environment variables from `.env.example` in your `.env` file.
2. If not already done, run the command `npx prisma generate`.
3. Run the command `docker compose up db` to start a local PostgresSQL database.

Note: To use the actual production database hosted by Supabase, set the `POSTGRES*` variables and the `DATABASE_URL` to our secret values.

### API

Ask team members what values `SPOTIFY_CLIENT_SECRET` and `SPOTIFY_CLIENT_ID` should be assigned in your `.env` file, as the correct values are needed to connect to the API.

## Project Plan Links

GitHub Projects: https://github.com/users/suprads/projects/2

OneDrive: https://mailuc.sharepoint.com/:f:/r/sites/SeniorDesign2526-Prof.Dekok-Group52/Shared%20Documents/Group%2052%20-%20Harmony%20Hub?csf=1&web=1&e=WZB0To
