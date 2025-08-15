# Test intro

## Implementation notes

### Controllers
I'd say the toughest part was defining the interop layer between controllers and React. Specifically, finding the balance between following the OOP practices and still writing idiomatic React. I found that controllers needed to be React-aware, as even such basic functionality as navigation - is done through hooks, which only operate in the context of a React component tree. Although I feel like there are quite a few ways how this could be sliced. I am happy with the implementation I ended up with, as it still relies on DI while abstracting that away from the consumer, while also staying close to React for all of the compositional benefits we use React for.

### Task interpretations

1. The task didn't explicitly mentioned restricting access to the /dashboard route, therefore I have omitted it from the implementation.
The "welcome" page still navigates to /dashboard as per requirements of the task, but direct access to /dashboard isn't restricted in any way.
Having said that, I did add basic session management methods to the authentication service which would make this trivial to implement. But given that it would make
some of the other requirements of the /dashboard page hard to test (defaulting to the "feed" view, for example) - I decided against implementing the route guard.
In reality, this would be managed either with a secure httpOnly cookie from the server, or with a short-lived in-memory session token and an authentication API endpoint to refresh sessions.

2. Task mentioned a "React web app", which I interpreted as a requirement to have a client-side React application.

## Versions

### Nix
The repo is configured with Nix flakes - so if you use Nix, you can simply run `nix develop` to download the required global dependencies.

### Alternative

Alternatively, use your global dependency manager of choice, versions used are below:

- pnpm@10.14.0
- node@24.5.0

---

Welcome to your new TanStack app! 

# Getting Started

To run this application:

```bash
pnpm install
pnpm start
```

# Building For Production

To build this application for production:

```bash
pnpm build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
pnpm test run
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.


## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. The following scripts are available:


```bash
pnpm lint
pnpm format
pnpm check
```

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).
