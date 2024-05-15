// @ts-ignore
const formResetPwd = document.querySelector('#resetPassForm');

formResetPwd?.addEventListener('submit', async event => {
  event.preventDefault();

  // @ts-ignore
  const formData = new FormData(formResetPwd);
  const email = formData.get('email');
  console.log('Email:', email);

  const response = await fetch('/api/users/resetpass', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email})
  });

  if (response.ok) {
    alert('Please check your email to reset your password');
    window.location.href = '/login';
  } else {
    const error = await response.json();
    alert(error.message || 'Failed to send reset email');
  }
});

