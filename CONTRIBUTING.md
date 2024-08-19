# Contributing to multikey

Firstly, thank you for taking the time to contribute! We welcome contributions from the community and are grateful for any help you can provide.

## Table of Contents

- [Contributing to multikey](#contributing-to-multikey)
  - [Table of Contents](#table-of-contents)
  - [How to Report Issues](#how-to-report-issues)
  - [How to Submit Code Changes](#how-to-submit-code-changes)
  - [Coding Standards](#coding-standards)
  - [Running Tests](#running-tests)

## How to Report Issues

If you find a bug or have a feature request, please report it using the GitHub [issue tracker](https://github.com/IBAX-io/multikey/issues). 

When reporting an issue, please include:

- A clear and descriptive title.
- A detailed description of the problem or suggestion.
- Steps to reproduce the issue, if applicable.
- Any error messages or screenshots that may help diagnose the problem.

## How to Submit Code Changes

We follow the GitHub Flow for our development process. Here's how you can contribute your changes:

1. **Fork the repository**: Click the "Fork" button at the top right of the repo's page.

2. **Clone your fork**: Clone your forked repository to your local machine.

```bash
git clone https://github.com/IBAX-io/multikey.git
cd multikey
```

3. **Create a branch**: Create a new branch for your work.

```bash
git checkout -b my-feature-branch
```

4. **Make your changes**: Make your changes in the new branch.

5. **Test your changes**: Ensure that all existing and new tests pass.

6. **Commit your changes**: Commit your changes with a clear and descriptive commit message.

```bash
git commit -m "Add new feature"
```

7. **Push to your fork**: Push your changes to your forked repository.

```bash
git push origin my-feature-branch
```

8. **Open a Pull Request**: Navigate to the original repository and open a pull request from your forked branch.

In your pull request, please include:

- A clear and descriptive title.
- A detailed description of the changes.
- Any relevant issues or feature requests that the changes address.

## Coding Standards

To maintain consistency in the codebase, please adhere to the following coding standards:

- Use [ESLint](https://eslint.org/) for JavaScript code linting.
- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).
- Ensure your code is well-documented.

## Running Tests

Before submitting your changes, please ensure that all tests pass. To run the tests, use the following command:

```bash
pnpm test
```
