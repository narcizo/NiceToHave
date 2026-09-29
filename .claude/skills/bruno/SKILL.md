---
name: bruno
description: Conventions for creating or extending a Bruno collection (`.bru` files, the open-source Postman alternative) for an HTTP API this project serves — layout, environments, chaining, tests, running with `bru run`. Use when adding or changing endpoints that need Bruno requests, when the `plan` skill calls for scaffolding a collection, or when the user says "add a Bruno request", "create the Bruno collection", "run the collection", "cria a collection do Bruno", "roda o Bruno".
---

# Bruno collections

Conventions for creating or extending a Bruno collection for an HTTP API.

## Layout

```
bruno/
  bruno.json              # { "version": "1", "name": "<project>", "type": "collection", "ignore": ["node_modules", ".git"] }
  environments/local.bru  # baseUrl and shared ids
  <resource>/folder.bru   # meta { name, seq } sets folder order
  <resource>/<action>.bru # one request per endpoint or behavior; kebab-case filename, readable meta name
```

## Environments and variables

- Take `baseUrl` from the server's real port (entry file or config), not an assumed default.
- Ids that several requests share (seed data, default tenant) go in the environment, not hard-coded in bodies.
- Secrets never go in `.bru` files: use `{{process.env.NAME}}` with a gitignored `bruno/.env` and a committed `.env.example`.

## Chaining requests

- Capture values from a response with `vars:post-response { resourceId: res.body.id }` and use `{{resourceId}}` in later requests.
- Order dependent requests with `meta.seq`, and state the dependency in a `docs {}` block.
- Values that must be unique per run (idempotency keys, emails) come from a `script:pre-request` block, e.g. `` bru.setVar("key", `run-${Date.now()}`) ``.

## Tests

- Every request has a `tests {}` block asserting the status and the fields that prove the behavior.
- Cover the happy path plus the main failures: validation (400), not found (404), business-rule rejections.

## Running

- `bru run --env local` from the collection folder, with the dev server up. Override values with `--env-var name=value`.
- An unexpected 404 or response shape → check which process is listening on the port before debugging the code.
- The runner is sequential, so it cannot prove concurrency fixes. Cover those with automated tests.
- A run changes server state. Say so when the user depends on seed data.
