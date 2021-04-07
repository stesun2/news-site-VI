# News Site Part VI

## High Level Objectives

1. Wire up Login Page using React's [Context API](https://reactjs.org/docs/context.html).
2. Modify AppNav.js to show a "Log In" link if a user isn't logged in, and a "Log Out" link if a user is logged in.
3. Only show the "Add An Article" link when a user is logged in, and include the user's access token to the now-protected Add Article API endpoint.

## Single Page App Authentication Overview

In single page apps, the authentication/login flow looks something like this:

1. User navigates to login page.
2. After entering their credentials and hitting submit, the login credentials are sent to an API endpoint/web service
3. The API checks the credentials - if they're valid, an access token is returned.
4. Requests made to "protected" API endpoints require a user access token.  If a token is not included in a request to a protected endpoint or the token has expired, a 401 unauthorized response status code is returned.  If the token is valid, the requested resource is returned successfully (a 200 response).
5. When any API request is made with a valid token, the token's expiration is extended.  If the user is inactive for a certain period of time, the token will expire and the user will be asked to log in again.

## Initial Setup

If you want to use your own code from `news-site-v`, you can copy and paste the entire `src` directory and replace the one in this repo.

**After copying over your source directory, run `npm run update-app`.**  This command will update a few unit tests in your `src` directory.

Once you've performed the steps above, run ```npm install ; npm run start``` - verify that no errors appear in your browser console or terminal, and that your app functions the same as it did in the last challenge.

## UsersAPI.login()

So far, we've only utilized a single type of object/model from the API - the Article. In today's challenge, we will be dealing with a new model - the User.  While it's not required, I consider it helpful to make separate JavaScript modules for interacting with different models of data that APIs can return.  As such, let's create an API JS module that we can use to just talk to the users API: `src/api/UsersAPI.js`. (Running `npm run update-app` during the initial setup should have created this file for you. If not, a dummy file and test file can be found under `/api/temp/VI/`.)

Inside this `UsersAPI.js` module, we should create a function: `UsersAPI.login(credentialsObject)`.  The login function accepts a parameter called `credentialsObject` - the structure of the `credentialsObject` that this function should accept will look like this:

```js
// IMPORTANT: this is the email & password to use for the API today
{
  email: "john@doe.com",
  password: "opensesame"
}
```

This function should create a request that's almost identical to the `ArticlesAPI.addArticle()` function.

When `UsersAPI.login()` is called, a POST request should be made to `http://localhost:3001/api/users/login?include=user` - the `credentialsObject` should be stringified and passed in the request body, and the content-type should be set to application/json.  The function should return a Fetch Promise that we will resolve later.

There is a unit test that verifies the expected behavior of UsersAPI.login() - once this test succeeds, you may proceed to the next section.

## Storing the User Object/Token using React Context

When valid credentials to the `api/users/login` endpoint are provided, the API response will look something like this:

```js
{
  "id":"O2FbDOTQeamtD6Uoz2EkyPvekxbh9u6F99jt7GGzdyDdPZ3NzoJx4uIt0AG5ngJb",
  "ttl": 20,
  "created": "2017-04-20T02:46:29.454Z",
  "userId": 1,
  "user": {
    "username": "John",
    "email": "john@doe.com",
    "id": 1
  }
}
```

You will want to call `UsersAPI.login()` from `src/pages/LoginPage.js`. While we could technically house the user information in the `state` of `App.js` and pass it down to all child components via `props`, this can get messy as the application grows over time. Instead, we'll use [React's Context API](https://reactjs.org/docs/context.html), which provides a way to pass data through the component tree without having to pass props down manually at every level. Contexts are generally created and used to store information that many pieces of the application will need to access. Common examples include user information and custom-theming (e.g. light theme v. dark theme).

The first thing we'll need to do is create the `UserContext` so that it can be accessed by child components throughout the app. In the `src` directory, create a new directory called `contexts` and create a new module named `UserContext.js`. In this module, we will create and export our `UserContext` object:

```javascript
import { createContext } from 'react';

const UserContext = createContext({
  user: null, // default user value will be null
  setUser: () => {}, // for now, we'll simply create an empty setUser function
});

export default UserContext;
```

The context object that we just created and exported has two React components: a `<Provider>` and a `<Consumer>`. Since we want to provide this `UserContext` to the rest of our application, we'll need to import the `UserContext` into `App.js` and then use it to wrap our `AppNav` and `<Route>`s in the [Provider](https://reactjs.org/docs/context.html#contextprovider):

```javascript
import UserContext from './contexts/UserContext.js';

// in the render()
<UserContext.Provider value={{ user: this.state.user }}>
  <AppNav />
  // ... all of the routes
</UserContext.Provider>
```

Notice that we're passing a `value` object into the `<Provider>`. The "shape" of this object must match that of the object used to create the context (in this case, an object with a `user` and a `setUser` method). As you can see above, these values will be coming from `App.js`'s state, so for this to work, you will need to (a) add state to the App class component and instantiate a user as `null`, (b) create a class method in `App.js` that accepts the User object as a parameter and sets it into state, and then (c) pass that method into the LoginPage.js.

For Item `b` in the paragraph above, let's create a method called handleLogin:

```
handleLogin = (user) => {
  this.setState({
    user: user
  })
}
```

Passing this method into the LoginPage component does require you to use some functionality available from React Router's `<Route>` component that we haven't used before - the `render` prop.

Up until now, the `<Routes>` we've defined have utilized two props - `path` and `component`.  We will continue to use the `path` prop to define the Route path, but we will need to use a new prop called `render` to pass data/props into the components our routes display.

The `component` prop that we've used thus far accepts a component as a value.  The `render` prop, however, accepts a function that returns a component.  Here's an example of what using `render` looks like:

```javascript
const renderLoginPage = (props) => {
  return (
    <LoginPage
      history={props.history}
      handleLogin={this.handleLogin} />
  )
}

<Route exact path="/login" render={renderLoginPage} />
```

In the function provided to the `render` prop of a `<Route />`, a single argument will be provided (in this example, the argument is called "props"). This object contains all of the `props` that React Router provides to components (i.e., location, match, history). This data can then be passed down into the components that the function returns. Note how `props.history` is being passed into the `<LoginPage>` component.  In addition, things within the scope of the class can be passed into the component that the function returns - things like `this.state`, and class methods.

In `App.js`'s render() method, add the `renderLoginPage` function above and modify your `/login` route to use the `render` prop, and pass in this function.

At this point, it is assumed that your `LoginPage.js` has a login form, and the login form's `onSubmit` event is calling an event handler. If this hasn't been done that, you will need to do that in order to proceed.

In your login form's `onSubmit` event handler, invoke `UsersAPI.login()` - of course, you will need to parse out the email and password fields from your form, store them into an object, and then pass the object to `UsersAPI.login()`.  In `UsersAPI.login().then` callback function, call the the function you passed into the LoginPage (e.g. `this.props.handleLogin(user)`) and pass in the response from the API. Also, redirect the page back to the home page (`this.props.history.push('/')`). (Note: Also consider error-handling here -- what will you do if a user enters incorrect credentials?)

Add a `console.log(this.state)` to `App.js`' render function temporarily to verify that the data from the API is making it's way from your `LoginPage.js` component back up to `App.js` - once you've confirmed this, you may move on to the next step.

## Authenticated Article Submission: ArticlesAPI.js
If you attempt to submit an article from your app in it's current state, you'll notice that the API will return a 401 Unauthorized status code. The version of the API included in this repo has protection around the `api/articles` POST route - in order to POST an article, you need to include a valid token in the request.

First, let's update `ArticlesAPI.addArticle()`. At the moment, this function accepts a single parameter - an Article object. Add an additional parameter for this function called `token`:

```js
const addArticle = (articleObject, token)
```

When an API endpoint requires authorization/authentication, it's customary to provide this data via a header called `Authorization`.  Add a new property to the header object in the addArticle function called `Authorization`, and set the value to the token argument.

There is a unit test that asserts this new behavior - once the `ArticlesAPI.js` unit test succeeds, you may proceed to the next section.

## Authenticated Article Submission: AddArticlePage.js
As we now need the user object (or specifically, the token) in order to submit an article, we need to provide this data to the `AddArticlePage.js` component. Put another way, the `AddArticlePage` must be a "consumer" of the `UserContext` that we created.

In order to accomplish this, we will need to import the `UserContext` into `AddArticlePage.js` and use the other React Component that `createContext` gives us: the [Consumer](https://reactjs.org/docs/context.html#contextconsumer). Let's look at some code and then walk through it:

**Note:** The below code snippet is for a Class Based Component. Look at using `contextType` to access the context throughout the Class Component. Continue reading on how to use to pass the UserContext to a functional component. 

```javascript
import UserContext from '../contexts/UserContext';

// in the render()
return (
      <UserContext.Consumer>
        {userContext => (
          <Form>
            // ...the rest of the Add Article form
          </Form>
        )}
      </UserContext.Consumer>
    )
```

Here we're wrapping our Add Article form in the `<UserContext.Consumer>` component. This gives us access to the `UserContext`, and we can do things like render the form conditionally (we'll come back to this), and pass the user authentication token along when the form is submitted.

In `AddArticlePage.js`, add a second parameter to `ArticlesAPI.addArticle()` that contains the user's token (it's contained within the `UserContext` at `user.id`): `ArticlesAPI.addArticle(articleObject, userContext.user.id)`

At this point, when you are logged in, you should be able to successfully submit an article.  If you can, you may continue.

**Note for Functional Components:** With the introduction of hooks, React gave us the [useContext()](https://reactjs.org/docs/hooks-reference.html#usecontext) hook. Instead of having to wrap components in a `<Consumer>` and use a method to pass along the context to the rendered component in the JSX, one can simply hook into the context and grab the value directly:
```javascript
import UserContext from '../contexts/UserContext';

// in the component
const userContext = React.useContext(UserContext);
const authToken = userContext.user.id;
```

## AppNav.js

As users who aren't logged in are now unable to post articles, we should only have the "Add An Article" button appear in the AppNav.js component when a user is logged in.  In order to accomplish this, you will need to make the `AppNav` component a consumer of the `UserContext` (just like we did above). Once the `AppNav` is wrapped in a `<UserContext.Consumer>`, it might be safe to say that if `userContext.user` is not null, you can assume a user is logged in.

In addition to making the "Add An Article" button appear only when appropriate, let's add Log In and Log Out links to the navigation - and display the appropriate one in the appropriate situation.

For the Log In and Log Out links, you can use React Router's `<Link>` component.  Example:
```js
<Link to="/login">Log In</Link>
<Link to="/logout">Log Out</Link>
```

Again, you'll want to display these links when appropriate - if a user is logged in, show the Log In link - if the user isn't logged in, show the log in link.

If you completed the news-site-V challenge, you should already have a route for `/login`.  You won't have a route defined for `/logout`, though - we'll get to that.

You should still be able to verify the functionality you just built.  Load up the app - verify that by default, the "Add An Article" link doesn't appear and the "Log In" link does.  Clicking the Log In link, you should be brought to pages/LoginPage.js.  Filling out the Login form with valid credentials, you should be redirected back to the Home Page - and `AppNav` should update so that the "Add An Article" and the "Log Out" links should appear.

## A few last `<Routes />`

At this point, all high level objectives have been reached - we're authenticating users, we're updating the navigation to show portions of the site that only logged in users are able to access, and we're providing the proper authentication in order to submit an article.

There are two last things we should do - we need to add a Route that handles logging out, and we should add in some protection to the /add-article route.

For the /logout route, we will create another `<Route />` that accepts a function via the `render` prop.  Let's call this function that we'll be passing into this route `renderLogout`.  Since the logic is simple enough, we'll just give you this function:

```js
const renderLogout = (props) => {
  this.setState({ user: null })
  return (
     <Redirect to="/login" />
  )
}
```

And the Route would look like this:
```
<Route exact path="/logout" render={renderLogout} />
```

Hitting http://localhost:3000/logout, `this.state.user` will be null'ed out and the page will redirect back to the homepage.

The `<Redirect />` component - something that React Router provides - simply is used to redirect from one page to another.  Let's use this component again to achieve the following behavior:

If a user is not logged in and attempts to go to the /add-article route, they should be redirected to the login page.  If a user is logged in, the /add-article route should display the AddArticle Page. (This can be done in either `App.js` or `AddArticlePage.js`)

**Refactoring:** Once everything is working, go ahead and refeactor your `functional-version`. Getting some practice with the [useContext()](https://reactjs.org/docs/hooks-reference.html#usecontext) hook should be very handy.
