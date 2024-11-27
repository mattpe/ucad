/* eslint-disable no-undef */

// NOTE: you need to change apiIUrl to match your server address
// CHECK also endpoint paths in fetch() functions
const apiUrl = 'http://localhost:3000';
const output = document.querySelector('#output');
let token = '';

// Handle submission for Reg Form 3
const regForm3 = document.querySelector('#reg-form-3').querySelector('form');
regForm3.addEventListener('submit', async (event) => {
  // Prevent default form behavior (page reload and redirect)   
  event.preventDefault();
  const user = {
    username: regForm3.username.value,
    password: regForm3.password.value,
    email: regForm3.email.value
  };

  const response = await fetch(apiUrl + '/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user),
  });
  const result = await response.json();
  console.log('reg form 3 resp', result);
  output.textContent = JSON.stringify(result);
});


// Handle submission for Login Form 3 and store token to variable
const loginForm2 = document.querySelector('#login-form-2').querySelector('form');
loginForm2.addEventListener('submit', async (event) => {
  // Prevent default form behavior (page reload and redirect)
  event.preventDefault();
  const user = {
    username: loginForm2.username.value,
    password: loginForm2.password.value,
  };

  const response = await fetch(apiUrl + '/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  const result = await response.json();
  console.log('login form 2 resp', result);
  output.textContent = JSON.stringify(result);
  // Consider storing token in localStorage or sessionStorage instead of variable
  token = result.token;
});

// Handle submission for Upload Form 2
// Using FormData Object (https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_FormData_Objects) 
const uploadForm2 = document.querySelector('#upload-form-2').querySelector('form');
uploadForm2.addEventListener('submit', async (event) => {
  // Prevent default form behavior (page reload and redirect)
  event.preventDefault();
  // Create FormData object from the html form
  const formData = new FormData(uploadForm2);
  const response = await fetch(apiUrl + '/api/media', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
    },
    body: formData,
  });
  const result = await response.json();
  console.log('upload form 2 resp', result);
  output.textContent = JSON.stringify(result);
});