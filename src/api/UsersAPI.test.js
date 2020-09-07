import UsersAPI from './UsersAPI';
import fetchMock from 'fetch-mock';
require('isomorphic-fetch');

afterEach(() => {
  fetchMock.restore();
})

it('logs in', (done) => {
  const request = fetchMock.post('http://localhost:3001/api/users/login?include=user', {success: true});
  const userObject = {email: 'john@doe.com', password: 'opensesame'};
  return UsersAPI.login(userObject)
    .then((json) => {
      const requestBody = request._calls[0][1].body;
      expect(requestBody).toEqual(JSON.stringify(userObject));
      expect(json.ok).toEqual(true);
      done();
    })
    .catch((err) => {
      throw new Error('Call failed');
    });
});
