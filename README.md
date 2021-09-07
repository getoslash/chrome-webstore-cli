<!-- deno-fmt-ignore-file -->
# Chrome Web Store CLI

[![deno version](https://img.shields.io/badge/deno-^1.13.2-lightgrey?logo=deno)](https://github.com/denoland/deno)
[![GitHub Release](https://img.shields.io/github/release/getoslash/chrome-webstore-cli.svg)](https://github.com/getoslash/chrome-webstore-cli/releases)
[![Release](https://github.com/getoslash/chrome-webstore-cli/actions/workflows/release.yml/badge.svg)](https://github.com/getoslash/chrome-webstore-cli/actions/workflows/release.yml)
[![codecov](https://codecov.io/gh/getoslash/chrome-webstore-cli/branch/main/graph/badge.svg?token=???)](https://codecov.io/gh/getoslash/chrome-webstore-cli)
[![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/getoslash/chrome-webstore-cli)

`cwc` is an easy-to-use command-line program for uploading & publishing your
extensions and themes to the
[Chrome Web Store](https://chrome.google.com/webstore/category/extensions).

If you're looking for programmatic access to the APIs behind this, you might
want to check out [cwa](https://github.com/getoslash/chrome-webstore-api).

## Installation

You can download the latest version of the CLI for your platform from the
[Releases](https://github.com/getoslash/chrome-webstore-cli/releases) page.

If you use Deno, you can also directly compile from source and install `cwc`
using the command —

```
deno install --quiet --allow-read --allow-write --allow-net=www.googleapis.com --allow-env --name cwc https://deno.land/x/cwc@1.0.0/mod.ts
```

## Usage

```
cwc

Usage:
  $ cwc <command> [options]

Commands:
  upload <source>  Upload directory or ZIP file to Chrome Web Store
  publish          Publish last upload to Chrome Web Store

For more info, run any command with the `--help` flag:
  $ cwc upload --help
  $ cwc publish --help

Options:
  --extension-id <id>              ID of the extension on the Chrome Web Store
  --client-id <client-id>          Google API OAuth2 client ID
  --client-secret <client-secret>  Google API OAuth2 client secret
  --refresh-token <refresh-token>  Google API OAuth2 refresh token
  -h, --help                       Display this message
```

### 🗜 Auto-Zip support

Note that `cwc` supports both files and directories for upload. If a directory
is provided as a source, it is automatically compressed into a ZIP file for
upload.

### 🕵🏼 Debugging

To debug the program or to get detailed logs, set the environment variable
`DEBUG` to `*`. For example, if you're a *Nix user, use the command —

```bash
DEBUG=* cwc <your options>
```

### Permissions

The app needs a few permissions –

| Permission                       | Reason                                                                                 |
| -------------------------------- | -------------------------------------------------------------------------------------- |
| `--allow-read`                   | Read files to upload                                                                   |
| `--allow-write`                  | To write temporary files when creating ZIP archive before upload                       |
| `--allow-env`                    | To detect the system's temporary files directory and to optionally get `DEBUG` options |
| `--allow-net=www.googleapis.com` | To upload/publish the item on the Chrome Web Store                                     |

## Recipes

1. <details>

   <summary>Upload and auto-publish your extension</summary>

   ```
   cwc upload --source "<path-to-extension>" --extension-id "<extension-id>" --client-id "<client-id>" --client-secret "<client-secret>" --refresh-token "<refresh-token>" --auto-publish
   ```

</details>

2. <details>

   <summary>Publish the last uploaded version of your extension</summary>

   ```
   cwc publish --extension-id "<extension-id>" --client-id "<client-id>" --client-secret "<client-secret>" --refresh-token "<refresh-token>"
   ```

</details>

3. <details>

   <summary>Publish the last uploaded version of your extension but only to trusted testers</summary>

   ```
   cwc publish --extension-id "<extension-id>" --client-id "<client-id>" --client-secret "<client-secret>" --refresh-token "<refresh-token>" --trusted-testers
   ```

</details>

## Developer Notes

1.Useful `deno` shorthand scripts and Git hooks are set up with
[velociraptor](https://velociraptor.run/docs/installation/). You can view a list
of the commands using –

  ```
  vr
  ```

## Make a release

1. Create a tag.

  ```bash
  git tag v0.0.0 -s -a -m "Release v0.0.0"
  ```
2. Push the tag to Github.

  ```bash
  git push --tags
  ```
3. Find the newly created tag on the [Tags page](https://github.com/getoslash/chrome-webstore-cli/tags) and Edit the release to include the changelog.
4. Publish the release. This triggers the workflow that attaches pre-built binaries to the release as attachments 🥳

## License

The code in this project is released under the [MIT License](LICENSE).

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fgetoslash%2Fchrome-webstore-cli.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fgetoslash%2Fchrome-webstore-cli?ref=badge_large)
