- This is a Web Extension Project
- Goal : Enhance ui of Hacker News.

- This project uses wxt framework for development. wxt is a extension development framework.
- for hacker news selector info please read selectors.md file, it has important info about selectors and how to use them.
- website to framework is : https://wxt.dev/
- you can find docs on these websites :

1. https://wxt.dev//knowledge/docs.txt
2. https://wxt.dev//knowledge/api-reference.txt

- use browser super global whenever you want to use chrome global. wxt uses browser global for development
  for example:
  browser.runtime.getURL() instead of chrome.runtime.getURL()

## Manifest :

In WXT, there is no manifest.json file in your source code. Instead, WXT generates the manifest from multiple sources:

Global options defined in wxt.config.ts file
Entrypoint-specific options defined in your entrypoints
WXT Modules added to your project can modify your manifest
Hooks defined in your project can modify your manifest
Your extension's manifest.json will be output to .output/{target}/manifest.json when running wxt build.

- this extension should work on https://news.ycombinator.com/
- always use aliases when importing,(@/ for root)
- this extension aims manifest v3
- this project uses typescript for development.
- this project uses prettier for code formatting.
- this project uses bun package manager, not npm.
- I should have a .prettierrc.json file in the root directory. please also follow rules on that.
- entrypoints are in entrypoints directory
