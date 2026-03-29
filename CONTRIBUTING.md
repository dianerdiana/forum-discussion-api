# Commit Message Guidelines

This project uses the **Conventional Commits** specification to keep commit history clear, structured, and easy to read.

## Commit Message Structure

```

<type>(scope): <short summary>

[optional body]

[optional footer]

```

### Example

```

feat(auth): add refresh token mechanism

Implement refresh token endpoint and update JWT strategy
to support token rotation.

```

---

# Commit Types

Use one of the following types to describe the change:

| Type     | Description                                             |
| -------- | ------------------------------------------------------- |
| feat     | Introduces a new feature                                |
| fix      | Bug fix                                                 |
| refactor | Code change that neither fixes a bug nor adds a feature |
| docs     | Documentation changes                                   |
| style    | Formatting changes (whitespace, linting, etc)           |
| test     | Adding or updating tests                                |
| chore    | Maintenance tasks (dependencies, configs, etc)          |
| perf     | Performance improvements                                |
| build    | Changes affecting build system or dependencies          |

---

# Scope

Scope indicates the part of the codebase affected.

Examples:

- `auth`
- `user`
- `store`
- `database`
- `config`
- `docs`

Example:

```

feat(auth): add login endpoint
fix(user): handle null email validation

```

---

# Writing Rules

Follow these rules when writing commit messages:

1. Use **imperative mood**

   ✔ Correct

```

add login endpoint
fix token validation
update prisma schema

```

✘ Incorrect

```

added login endpoint
fixing token validation
updates prisma schema

```

2. Keep the **subject line concise (≤ 50 characters)**

3. Use **lowercase** for the commit message

4. Separate the **title and body with one blank line**

Example:

```

fix(auth): prevent login when user inactive

Add validation to check user status before issuing JWT.
Previously inactive users could still login.

```

---

# Examples

### Feature

```

feat(auth): implement jwt authentication

```

### Bug Fix

```

fix(user): prevent duplicate email registration

```

### Refactor

```

refactor(auth): extract token generation to service

```

### Dependency Update

```

chore(deps): update prisma to latest version

```

### Documentation

```

docs(readme): add installation instructions

```

---

# Recommended Commit Granularity

Make commits **small and focused**.

✔ Good

```

feat(auth): add login endpoint
fix(auth): validate password using bcrypt
docs(readme): update api documentation

```

✘ Bad

```

update many things
fix stuff

```

---

# Optional Footer

Footers are used to reference issues.

```

feat(auth): implement refresh token rotation

Closes #12

```
