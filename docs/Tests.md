Phase 1 — API
Jest
tests/
jest.config.ts
test scripts
1 smoke test
↓
verify independently

Phase 2 — Web
Vitest
tests/
vitest.config.ts
test scripts
1 smoke test
↓
verify independently

Phase 3 — Validation
test setup
tests/
test scripts
1 smoke test
↓
verify independently

Phase 4 — Root
Turbo test task
root npm scripts
npm test
↓
all 3 workspaces

                    npm test
                       │
                  turbo run test
             ┌─────────┼─────────┐
             ▼         ▼         ▼
           API        Web    Validation
          Jest       Vitest    Vitest
             │         │         │
             └─────────┼─────────┘
                       ▼
                  all tests ✓




                    C:\buildkiwi
                         │
                    npm test
                         │
                  turbo run test
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
     buildkiwi-api   buildkiwi-web   validation
        Jest            Vitest         Vitest
          ✓               ✓              ✓





             npm run test:coverage
                       │
                turbo run test:coverage
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
        Jest         Vitest       Vitest
       --coverage   --coverage    --coverage
          ✓            ✓             ✓

## Test Commands

| Command                 | Scope     | Description                                                  |
| ----------------------- | --------- | ------------------------------------------------------------ |
| `npm test`              | Root      | Run all tests across API, Web, and Validation via Turbo      |
| `npm run test:coverage` | Root      | Run all tests with coverage across the monorepo              |
| `npm test`              | Workspace | Run tests for the current workspace only                     |
| `npm run test:coverage` | Workspace | Run tests with coverage for the current workspace            |
| `npm run lint`          | Root      | Run ESLint across all workspaces via Turbo                   |
| `npm run typecheck`     | Root      | Run TypeScript type checking across all workspaces via Turbo |

### Run All Workspaces

| Command                 | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| `npm test`              | Run all tests across API, Web, and Validation using Turbo |
| `npm run test:coverage` | Run all tests across the monorepo with coverage           |

### API — Jest

Run from the repository root:

```bash
npm test --workspace=buildkiwi-api
npm run test:coverage --workspace=buildkiwi-api




BuildKiwi
│
├── packages/validation
│   ├── Unit tests
│   └── Contract/schema tests
│
├── apps/api
│   ├── Unit tests
│   ├── Integration tests
│   └── API/route tests
│
└── apps/web
    ├── Unit tests
    ├── Hook/context tests
    ├── Component tests
    └── Integration tests
```

                         ┌─────────────────────┐
                         │    npm run ci       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   FORMAT: CHECK     │
                         │ prettier --check .  │
                         └──────────┬──────────┘
                                    │
                         ❌ FAIL    │    ✅ PASS
                            │       │
                            ▼       ▼
                    npm run format  ┌─────────────────────┐
                                    │       LINT          │
                                    │   turbo run lint    │
                                    └──────────┬──────────┘
                                               │
                                    ❌ FAIL    │    ✅ PASS
                                       │       │
                                       ▼       ▼
                               npm run lint -- --fix
                                               │
                                               ▼
                                    ┌─────────────────────┐
                                    │     TYPECHECK       │
                                    │ turbo run typecheck │
                                    └──────────┬──────────┘
                                               │
                                    ❌ FAIL    │    ✅ PASS
                                       │       │
                                       ▼       ▼
                              Fix TypeScript    ┌─────────────────────┐
                              errors manually   │       TEST          │
                                               │   turbo run test    │
                                               └──────────┬──────────┘
                                                          │
                                               ❌ FAIL    │    ✅ PASS
                                                  │       │
                                                  ▼       ▼
                                           Fix failing tests ┌─────────────────┐
                                                              │      BUILD      │
                                                              │ turbo run build │
                                                              └────────┬────────┘
                                                                       │
                                                            ❌ FAIL    │    ✅ PASS
                                                               │       │
                                                               ▼       ▼
                                                        Fix build errors  🎉 CI PASSED
