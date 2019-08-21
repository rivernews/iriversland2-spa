# Iriversland2-spa
The frontend of my personal website.

## How to run

1. `npm i && npm rebuild node-sass`
1. `$(npm bin)/ng serve -o` to run Angular development server.

## Deploy Angular App to Github Page

[Following this Medium post](https://codeburst.io/deploy-react-to-github-pages-to-create-an-amazing-website-42d8b09cd4d) with change to output the built angular files to `/dist/`. 
- Refer to [package.json](package.json) for the command, and [angular.json](angular.json) for the output built files.
- Also refer to [Angular doc: Deployment](https://angular.io/guide/deployment#deploy-to-github-pages) to add the `--base-href` parameter. This is important [for both static files and routing](https://stackoverflow.com/a/49093627/9814131) in angualr.
- Finally run `npm run deploy`

## System Design

### Why separate frontend and backend code base?

PROS

- Reduced backend docker image size
- Improved backend build time, especially when only change in backend, but the CI/CD still has to rebuild frontend
- Saved us resources and $$ to offload works on K8 cluster, which is pricy. Static website hosting nowadays is deeply cheap.
- Serves frontend Angular app faster on CDN/S3..., comparing to using our own K8 cluster
- Hassleless on dealing with frontend routing & backend routing interference. Will need complicated ingress rules to direct traffic to either backend or frontend correctly.

CONS

- Frontend build is not included in the entire CI/CD process now. Maybe it's still possible, but we haven't come up with one yet.
  - Perhaps just setting up CircleCI for frontend makes a lot of sense - when commit git and push, CircleCI builds and deploy website for us, which means that CircleCI has to have permission to push to github. Another topic for issue. But, it can be easily done at local (my laptop) by just one command - `npm run deploy`, so didn't see any urgent need on this. Would still be great to have version control tied with CI/CD process though, also good for later on expansion like adding test stage, etc.