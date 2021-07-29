const BASE_URL = 'http://localhost:3001/api/users/login?include=user'

const login = async (credentialsObject) => {
  let response = await fetch(BASE_URL, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(credentialsObject)
  });
}

export default {
  login
}
