# News Site Part VI

## High Level Objectives

 1. Wire up Login Page - when the login form is submitted, POST login credentials to the login API endpoint and store the access token that's returned in the response from the API in App.js' state.
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

You will want to copy over the work you did in the News Site V challenge into this repo - this time, you can copy and paste the entire `src` directory from the news-site-IV repo and paste it directly into this repo.

**After copying over your source directory, run `npm run update-app`.**  This command will update a few unit tests in your src/ directory.

Once you've performed the steps above, run ```npm run start``` - verify that no errors appear in your browser console or terminal, and that your app functions the same as it did in the last challenge.  

## UsersAPI.login()

So far, we've only utilized a single type of object/model from the API - the Article.  In today's challenge, we will be dealing with a new model - the User.  While it's not required, I consider it helpful to make separate JavaScript modules for interacting with different models of data that APIs can return.  As such, I've created a separate module for handling API requests for the User model - it's called src/api/UsersAPI.js.  

The UsersAPI.js module contains a function that's been stubbed out - UsersAPI.login(credentialsObject).  The login function accepts a parameter called credentialObject - the structure of the credentialsObject that this function should accept will look like this:

    {
      email: "john@doe.com",
      password: "opensesame"
    }

This function should create a request that's almost identical to the ArticlesAPI.addArticle() function.  

When UsersAPI.login() is called, a POST request should be made to ```http://localhost:3001/api/users/login?include=user``` - the credentialsObject should be stringified and passed in the request body, and the content-type should be set to application/json.  The function should return a Fetch Promise (just as all of the functions we made in ArticlesAPI.js do).

There is a unit test that verifies the expected behavior of UsersAPI.login() - once this test succeeds, you may proceed to the next section.

## Storing the User Object/Token

When valid credentials to the ```api/users/login``` endpoint are provided, the API response will look something like this:

    {         "id":"O2FbDOTQeamtD6Uoz2EkyPvekxbh9u6F99jt7GGzdyDdPZ3NzoJx4uIt0AG5ngJb",
      "ttl": 20,
      "created": "2017-04-20T02:46:29.454Z",
      "userId": 1,
      "user": {
        "username": "John",
        "email": "john@doe.com",
        "id": 1
      }
    }
    
You will want to call UsersAPI.login() from src/pages/LoginPage.js, but you will need to store the response object in the top-level state of your app - inside of App.js's state.  This is because this data will need to be passed down into other pages (that will be covered more in detail below).

In order to store the User object into App.js's state, you will need to (a) create a class method in App.js that accepts the User object as a parameter and sets it into state, and then (b) pass that method into the LoginPage.js.  

For Item A in the paragraph above, let's create a method called handleLogin:

    handleLogin(user) {
      this.setState({
          user: user
        })
    }

Passing this method into the LoginPage component does require you to use some functionality available from React Router's ```<Route>``` component that we haven't used before - the ```render``` prop.

Up until now, the ```<Routes>``` we've defined have utilized two props - ```to``` and ```component```.  We will continue to use the ```to``` prop to define the Route path, but we will need to use a new prop called ```render``` to pass data/props into the components our routes display.

The ```component``` prop that we've used thus far accepts a component as a value.  The ```render``` prop, however, accepts a function that returns a component.  Here's an example of what using ```render``` looks like:

    const renderLoginPage = (props) => {
      return (
        <LoginPage 
          history={props.history}
          handleLogin={this.handleLogin.bind(this)} />
      )
    }
    
    <Route exact path="/login" render={renderLoginPage} />

In the function provided to the ```render``` prop of a ```<Route />```,  a single argument will be provided (in this example, the argument is called "props").  This object contains all of the props React Router provides to components (location, match, history).  This data can then be passed down into the components that the function returns.  Note how props.history is being passed into the ```<LoginPage>``` component.  In addition, things within the scope of the class can be passed into the component that the function returns - things like this.state, and class methods.

In App.js's render() method, add the renderLoginPage function above and modify your /login route to use the ```render``` prop, and pass in this function.

At this point, it is assumed that your LoginPage.js has a login form, and the login form's onSubmit event is calling an event handler.  If this hasn't been done that, you will need to do that in order to proceed.

In your login form's onSubmit event handler, invoke UsersAPI.login() - of course, you will need to parse out the email and password fields from your form, store them into an object, and then pass the object to UsersAPI.login().  In UsersAPI.login().then callback function, call the the function you passed into the LoginPage ( e.g. this.props.handleLogin(user) ) and pass in the response from the API.  Also, redirect the page back to the home page ( this.props.history.push('/') ).

Add a console.log(this.state) to App.js' render function temporarily to verify that the data from the API is making it's way from your LoginPage.js component back up to App.js - once you've confirmed this, you may move on to the next step.

## Authenticated Article Submission: ArticlesAPI.js

Add a console.log(this.state) to App.js' render function temporarily to verify that the data from the API is making it's way from your LoginPage.js component back up to App.js - once you've confirmed this, you may move on to the next step.

## Authenticated Article Submission: ArticlesAPI.js

If you attempt to submit an article from your app in it's current state, you'll notice that the API will return a 401 Unauthorized status code.  The version of the API included in this repo has protection around the api/articles POST route - in order to POST an article, you need to include a valid token in the request.  

First, let's update ArticlesAPI.addArticle().  At the moment, this function accepts a single parameter - an Article object.  Add an additional parameter for this function called "token":

    const addArticle = (articleObject, token)

When an API endpoint requires authorization/authentication, it's customary to provide this data via a header called "Authorization".  Add a new property to the header object in the addArticle function called "Authorization", and set the value to the token argument.  

There is a unit test that asserts this new behavior - once the ArticlesAPI.js unit test succeeds, you may proceed to the next section.

## Authenticated Article Submission: AddArticlePage.js

As we now need the user object (or specifically, the token) to submit an article, we need to provide this data to the AddArticlePage.js component.  

In order to accomplish this, we will need to modify the add-article ```<Route />``` to use the ```render``` prop instead of the ```component``` prop, as we need to pass additional information into the AddArticlePage component.  Create a function similar the ```renderLoginPage()``` function detailed above.  Let's name this new function ```renderAddArticlePage``` - for now, it should just return the AddArticle component with this.state.user passed into the component.  Let's pass in this.state.user through a prop called "user".  

Set this function to the value of the add-article ```<Route />```:

    <Route exact path="/add-article" render={renderAddArticlePage} />
            
In AddArticlePage.js, add a second parameter to ArticlesAPI.addArticle() that contains the user's token (it's contained within a property within the user object called "id"):

    ArticlesAPI.addArticle(articleObject, this.props.user.id)

At this point, you should be able to successfully submit an article.  If you can, you may continue.

## AppNav.js 

As users who aren't logged in are now unable to post articles, we should only have the "Add An Article" button appear in the AppNav.js component when a user is logged in.  In order to accomplish this, you can simply pass in App.js's this.state.user into the AppNav.js component and key off of that.  If this.state.user is null, you can assume the user isn't logged in.  If this.state.user isn't null, you can assume a user is logged in.  

In addition to making the "Add An Article" button appear only when appropriate, let's add Log In and Log Out links to the navigation - and display the appropriate one in the appropriate situation.  

For the Log In and Log Out links, you can use React Router's ```<Link>``` component.  Example:

    <Link to="/login">Log In</Link>
    <Link to="/logout">Log Out</Link>

  Again, you'll want to display these links when appropriate - if a user is logged in (aka this.props.user is not null), show the Log In link - if the user isn't logged in (aka this.props.user is null), show the log in link.

If you completed the news-site-V challenge, you should already have a route for ```/login```.  You won't have a route defined for ```/logout```, though - we'll get to that.

You should still be able to verify the functionality you just built.  Load up the app - verify that by default, the "Add An Article" link doesn't appear and the "Log In" link does.  Clicking the Log In link, you should be brought to pages/LoginPage.js.  Filling out the Login form with valid credentials, you should be redirected back to the Home Page - and AppNav.js should update so that the "Add An Article" and the "Log Out" links should appear.

## A few last ```<Routes />```

At this point, all high level objectives have been reached - we're authenticating users, we're updating the navigation to show portions of the site that only logged in users are able to access, and we're providing the proper authentication in order to submit an article.  

There are two last things we should do - we need to add a Route that handles logging out, and we should add in some protection to the /add-article route.  Both of these tasks will require new code to be added just to App.js.

For the /logout route, we will create another ```<Route />``` that accepts a function via the ```render``` prop.  Let's call this function that we'll be passing into this route ```renderLogout```.  Since the logic is simple enough, I'll just give you this function:

    const renderLogout = (props) => {
      this.setState({user: null});
      return (
         <Redirect to="/login" />
      )
    }

And the Route would look like this:

    <Route exact path="/logout" render={renderLogout} />

Hitting http://localhost:3000/logout, this.state.user will be null'ed out and the page will redirect back to the homepage.

The ```<Redirect />``` component - something that React Router provides - simply is used to redirect from one page to another.  Let's use this component again to achieve the following behavior:

If a user is not logged in and attempts to go to the /add-article route, they should be redirected to the login page.  If a user is logged in, the /add-article route should display the AddArticle Page. 