# Contributing to this project <!-- omit in toc -->

## Getting started <!-- omit in toc -->

Before you begin –

- Install the latest stable version of [Deno](https://deno.land/#installation)
- Install [velociraptor](https://velociraptor.run/docs/installation/)
- [VSCode](https://code.visualstudio.com/) is recommended, with a
  [Deno workspace initialized](https://deno.land/manual@master/vscode_deno#deno-enabling-a-workspace)

### Installing dependencies

Pull all dependencies while also
[checking integrity](https://deno.land/manual/linking_to_external_code/integrity_checking)
with the command –

```
vr install
```

### Modifying dependencies

If you are adding or upgrading dependencies, please ensure you update the
[`lock.json`](https://deno.land/manual/linking_to_external_code/integrity_checking)
file with the command –

```
vr reload
```

### Running all tests

To run all tests, run the command –

```
vr test
```

### Creating your first issue

Before you make your changes, check to see if an
[issue exists](https://github.com/getoslash/chrome-webstore-cli/issues/) already
for the change you want to make.

### Don't see your issue? Open one

If you spot something new, open an issue using a
[template](https://github.com/getoslash/chrome-webstore-cli/issues/new/choose).
We'll use the issue to have a conversation about the problem you want to fix.

### Ready to make a change? Fork the repo

Fork using GitHub Desktop:

- [Getting started with GitHub Desktop](https://docs.github.com/en/desktop/installing-and-configuring-github-desktop/getting-started-with-github-desktop)
  will guide you through setting up Desktop.
- Once Desktop is set up, you can use it to
  [fork the repo](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/cloning-and-forking-repositories-from-github-desktop)!

Fork using the command line:

- [Fork the repo](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo#fork-an-example-repository)
  so that you can make your changes without affecting the original project until
  you're ready to merge them.

Fork with [GitHub Codespaces](https://github.com/features/codespaces):

- [Fork, edit, and preview](https://docs.github.com/en/free-pro-team@latest/github/developing-online-with-codespaces/creating-a-codespace)
  using [GitHub Codespaces](https://github.com/features/codespaces) without
  having to install and run the project locally.

### Make your update

Make your changes to the file(s) you'd like to update.

- Are you making changes to the application code? You'll need **Deno v1.17+** to
  run the tests locally.
- Are you contributing to markdown? We use
  [GitHub Markdown](contributing/content-markup-reference.md).
- Writing a Git commit message? We use the
  [Angular commit convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular#readme).

### Open a pull request

When you're done making changes and you'd like to propose them for review, use
the [pull request template](#pull-request-template) to open your PR (pull
request).

### Submit your PR & get it reviewed

- Once you submit your PR, project members will review it with you. The first
  thing you're going to want to do is a self review.
- After that, we may have questions, check back on your PR to keep up with the
  conversation.
- Did you have an issue, like a merge conflict? Check out GitHub's
  [git tutorial](https://lab.github.com/githubtraining/managing-merge-conflicts)
  on how to resolve merge conflicts and other issues.

### Your PR is merged!

Congratulations! OSlash and the whole open-source community thanks you.
:sparkles:

Once your PR is merged, you will be proudly listed as a contributor in the
[contributor chart](https://github.com/getoslash/chrome-webstore-cli/graphs/contributors).
