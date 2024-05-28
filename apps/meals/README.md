## Getting Started

Sign in using gitlab maintainer email

```bash
vercel login
```

Link local repo to the family-projects-meals vercel project

```bash
vercel link
```

Pull dev env variables

```bash
vercel env pull
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Commands

Generate a migration file

```bash
pnpm db:generate
```

Drop a migration file

```bash
pnpm db:drop
```

Push changes to the remote database

```bash
pnpm db:push
```
