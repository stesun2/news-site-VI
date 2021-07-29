import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import AppNav from './components/AppNav/AppNav.js';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';
import AddArticlePage from './pages/AddArticlePage.js';
import ArticlePage from './pages/ArticlePage.js';
import SectionPage from './pages/SectionPage.js';

class App extends Component {
  state = {
    userInfo: null
  }
  render() {
    return (
      <div>
        <Router>
          <div>
            <AppNav />
            <Route exact path="/" component={HomePage} />
            <Route exact path="/login">
              <LoginPage setUserInfo={(info) => {this.setState({userInfo: info})}} />
            </Route>
            <Route exact path="/add-article">
              <AddArticlePage userInfo={this.state.userInfo} />
            </Route>
            <Route exact path="/articles/:articleID" component={ArticlePage} />
            <Route exact path="/sections/:sectionID" component={SectionPage} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;


// Functional solution:
// function App() {
//   return (
//     <div>
//       <AppNav />
//       <Router>
//         <div>
//           <Route exact path="/" component={HomePage} />
//           <Route exact path="/add-article" component={AddArticlePage} />
//           <Route exact path="/articles/:articleID" component={ArticlePage} />
//           <Route exact path="/sections/:sectionID" component={SectionPage} />
//         </div>
//       </Router>
//     </div>
//   );
// }
