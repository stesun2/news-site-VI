import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import UsersAPI from '../api/UsersAPI';

class LoginPage extends Component {

  handleFormSubmit = (event) => {
    event.preventDefault();

    let emailValue = event.target.elements[0].value
    let passwordValue = event.target.elements[1].value

    console.log(emailValue);
    console.log(passwordValue);

    let creds = {
      email: emailValue,
      password: passwordValue
    }

    let userInfo = {
      token: "",
      username: "",
      email: "",
      userId: ""
    }

    UsersAPI.login(creds)
  };

  render() {
    return (
      <div style={{padding: '20px'}}>
        <h3> Login </h3>
        <Form onSubmit={this.handleFormSubmit}>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input type="email" name="email" id="email" />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" name="password" id="password" />
          </FormGroup>
          <Button>Submit</Button>
        </Form>
      </div>
    )
  }
}

export default LoginPage;


// Functional solution:
// function LoginPage() {
//   const handleFormSubmit = (event) => {
//     event.preventDefault();
//     console.log(event.target.elements[0].value);
//     console.log(event.target.elements[1].value);
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h3> Login </h3>
//       <Form onSubmit={handleFormSubmit}>
//         <FormGroup>
//           <Label for="email">Email</Label>
//           <Input type="email" name="email" id="email" />
//         </FormGroup>
//         <FormGroup>
//           <Label for="password">Password</Label>
//           <Input type="password" name="password" id="password" />
//         </FormGroup>
//         <Button>Submit</Button>
//       </Form>
//     </div>
//   )
// };
