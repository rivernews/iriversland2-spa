# iriversland2-spa
The frontend of my personal website

## How to run

1. `npm i && npm rebuild node-sass`
1. `$(npm bin)/ng serve -o` to run Angular development server.

## Deploy Angular App to Github Page

[Following this Medium post](https://codeburst.io/deploy-react-to-github-pages-to-create-an-amazing-website-42d8b09cd4d) with change to output the built angular files to `/dist/`. 
- Refer to [package.json](package.json) for the command, and [angular.json](angular.json) for the output built files.
- Also refer to [Angular doc: Deployment](https://angular.io/guide/deployment#deploy-to-github-pages) to add the `--base-href` parameter. This is important [for both static files and routing](https://stackoverflow.com/a/49093627/9814131) in angualr.
- Finally run `npm run deploy`