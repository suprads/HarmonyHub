# Contributing

## Development Guidelines

### Naming Conventions

Make sure to add `.spec` between the file extension and name of end-to-end test files (e.g. `home.spec.ts`). For unit and integration test files, add `.test` between the extension and the test file name (e.g. `chart.test.tsx`).

### Code Formatting

- Run Prettier and ESLint before committing changes
- Use JSDoc to document any created functions
- Add comments for anything that isn't clear

### Third-party API Guidelines

- Keep calls to third-party APIs limited.
- Don't rerun API calls every page refresh and React state update.
- Keep any sensitive API information, like keys and credentials, server-side when possible.
