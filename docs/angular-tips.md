
# Iriversland

This is my online portfolio code base. To run this project locally, you'll have to prepare a database and provide the credentials.

# Frontend

## NPM Packages

run `npm i -D` on these packages:

```

angular2-recaptcha
tinycolor2 @types/tinycolor2

```

For other details for setting up, please see [the repo djangorest-angularcli-eb-seed](https://github.com/rivernews/djangorest-angularcli-eb-seed)

- [How do I change pushing to a different github repo?](https://help.github.com/articles/changing-a-remote-s-url/)

## Costom building Ckeditor5

[Following official doc](https://docs.ckeditor.com/ckeditor5/latest/builds/guides/development/custom-builds.html)

- cd to the right path
- clone / fork repo
- npm i
- now you can install any other npm packages you want by `npm i -D <package name>`
  - Include that new dependency in `src/ckeditor.js`
- `npm run build`

## Angular

Django - Angular Learning Notebook. How should something be done? What is the best practice and the "Angular" way? We took our note here.

### Environment

// TODO

### Service
Services handle access to data. Components get data from service and don't retrieve data directly.
Where to get data: in tutorial we use local storage - mock data, so just do `import HEROES from ...` and in method do `return HEROES` .
Expose the service to components.

#### Constructor
in [hero tutorial](https://angular.io/tutorial/toh-pt4):
> "Reserve the constructor for simple initialization such as wiring constructor parameters to properties. The constructor shouldn't do anything. It certainly shouldn't call a function that makes HTTP requests to a remote server …"

#### Asynchronic data acquiring
continue looking at [this tutorial.](https://angular.io/tutorial/toh-pt4)

### Routing
// TODO

### Directive
// TODO

### Test POST requesting and render the results
We need to create a component first.
`ng generate component <component name>`
Properties, variables, methods all be claimed in component's ts file. Then, you can use all these variables in component's html template.
You should now be able to use this component in other components. e.g. in the app-root component. Use it by adding a app- prefix like<app-your-component-name> .
We also need a service to do http request inside.
`ng generate service <your service name>` . If your service is PostService, the service name convention is just post .
Then, bring in the service into the component (in typescript file, where you need the data. Mainly two steps:
import the service
Inject the service by putting a private parameter of the service in the constructor argument. This gives the component a service property.

Some important things regarding asynchronous request: we need to use Observable. We include dependencies for that:

```js
import { Observable, of } from 'rxjs';
```


At this point, you may have to think of the data structure of the data, unfortunately. For example, if you are fetching post data from server, then you might want to create a class for that in Angular as well:

```js
// Create a file, can just put it in src/app
export class YourClassName {
    property_name: type;
    ....
}
```

Then you'll import this class in both the service and component's ts file too.
**! Question: do we really need to create a class for every response data type? It's really just copying Django's model over… (especially when using Django RESTful framework).**
**! Question: do we need to import the class twice, one in service one in component? So much overhead work!**
We are about to request http in service. Before this, however, we need to bring in all the http module dependencies. We just [refer to the tutorial](https://angular.io/tutorial/toh-pt6):

> 1. open the root AppModule,
> 2. import the HttpClientModule symbol from @angular/common/http,
> 3. add it to the @NgModule.imports array.
Then, in service:

```ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
...
constructor(private http: HttpClient, ...) {...}
...
```

Now let's request the data! In your service ts file, your get function should look like:

```ts
get_something(): Observable<type_of_data> {
    return this.http.get<type_of_data>(this.api_url);
}
private api_url = 'your api url';
```

**TODO**: deal with type of http response.
Now, back to your component. You will write a get_something() function as well, then call this function to get data in the ngOnInit() . You'll have something like this:

```ts
...
posts: Post[] = [];
...
ngOnInit() {
    this.getPost();
}
...
getPost(): void {
    this.postService.getPost()
        .subscribe(posts => {
        this.posts = posts;
    });
}
```

Lastly, in component's html show the data.
Now refresh the browser, the component will try to fetch the data and display them!

## Angular Material
Follow [this Getting Started page](https://material.angular.io/guide/getting-started) first. To summarize:

```
npm i -D @angular/material @angular/cdk @angular/animations

// 1. in app module ts
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
...
@NgModule({
  ...
  imports: [BrowserAnimationsModule],
  ...
})
...
// 2. import component modules in app module ts, one by one
import {MatSidenavModule, MatButtonModule, ...} from '@angular/material';
...
@NgModule({
  imports: [MatSidenavModule, MatButtonModule, ...],
  exports: [MatSidenavModule, MatButtonModule, ...],
})
// you can now use the material components you imported here

// 3. theming configuration (we're using angular/cli)
// in styles.css
@import "~@angular/material/prebuilt-themes/indigo-pink.css";
// structure your app root component html like this
<mat-sidenav-container fullscreen>
    Put all your components here, including router-outlet
</mat-sidenav-container>
```

Whenever you want to use a new material component, repeat step 2., then you can now add it in component htmls.

## Setting Angular Material in Separate Module
[See this article](https://medium.com/@armno/creating-a-custom-material-module-in-angular-ee6a5e925d30).

## Upgrading from Angular 6 to 7

- [Using this upgrade guide](https://update.angular.io/).
- For ` RxJS 6` migration part, do the following instead:
  - You can remove `rxjs-compat` from `package.json`.
  - Under `frontend/`, run `npm install rxjs-tslint`
  - Under `frontend/src`, create a file `tslint.rxJSmigration.json` which contains:

```json
{
    "rulesDirectory": [
      "../node_modules/rxjs-tslint"
    ],
    "rules": {
      "rxjs-collapse-imports": true,
      "rxjs-pipeable-operators-only": true,
      "rxjs-no-static-observable-methods": true,
      "rxjs-proper-imports": true
    },
    "jsRules": {
        "no-empty": true
    }
  }
```

  - Now back to `frontend/`, run `./node_modules/.bin/tslint -c src/tslint.rxJSmigration.json -p src/tsconfig.app.json`.
    - Will auto correct for you, but will throw ERROR when it cannot resolve the issue. Look at those error. Some of them are not true so you can just skip them. e.g. you already use `from "rxjs/operators";` to import pipes, which is the correct rxJS6 way, but it still shows ERROR about `duplicate rxjs import`.

- Do `ng update @angular/cli @angular/core`
- Before updating Angular Material, update `@angular/flex-layout` first to v7:
  - `npm uninstall -D @angular/flex-layout`
  - `npm i -D @angular/flex-layout`. This will install the latest for you instead of sticking to v6.
- You can now do `ng update @angular/material`
- Run the app. Notice there're some layout changes e.g.
  - The font size in card & chip is enlarged
  - Will shade when hover on chip.
  - ...
  - You'll want to fix them by `scss` if it's not desirable.
- That's it!

## Using Google Analytics in Angular

- [Use this angular adapter](https://github.com/angulartics/angulartics2)
- [How to write Event Tracking Info](https://developers.google.com/analytics/devguides/collection/analyticsjs/events)