# Markdown Table Formatter

Messy Markdown tables? Fix them automatically. This action reformats all Markdown tables in your repository to be perfectly aligned and readable.

## Features

-   **Auto-Align**: Aligns columns for readability.
-   **Bulk Process**: Handles multiple files at once.
-   **Configurable**: Ignore specific files or folders.
-   **Commit Changes**: Automatically commits the reformatted files.

## Usage

Create a workflow file (e.g., `.github/workflows/format-tables.yml`):

```yaml
name: Format Tables
on: [push]

jobs:
  format:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          ref: ${{ github.head_ref }}
          
      - name: Markdown Table Formatter
        uses: ./
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          files: '**/*.md'
```

## Inputs

| Input | Description | Default |
| :--- | :--- | :--- |
| `token` | GITHUB_TOKEN | `${{ github.token }}` |
| `files` | Glob pattern for files to check | `**/*.md` |
| `commit_message` | Commit message for fixes | `chore: format markdown tables` |

## Contact

Developed for Anunzio International by Anzul Aqeel.
Contact +971545822608 or +971585515742.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


---
### 🔗 Part of the "Ultimate Utility Toolkit"
This tool is part of the **[Anunzio International Utility Toolkit](https://github.com/anzulaqeel-anunzio/ultimate-utility-toolkit)**.
Check out the full collection of **180+ developer tools, scripts, and templates** in the master repository.

Developed for Anunzio International by Anzul Aqeel.
