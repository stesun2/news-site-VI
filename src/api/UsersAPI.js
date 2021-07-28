const BASE_URL = 'http://localhost:3001/api/users/login?include=user'

const login = async (credentialsObject) => {
  let response = await fetch(BASE_URL, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(credentialsObject)
  });
  if (!response.ok) 
    console.error('Not a valid response!')
  else {
    let data = await response.json()
    console.log(data)
  }

  return 
}

export default {
  login
}
