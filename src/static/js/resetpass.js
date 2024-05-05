// const formResetPwd = document.querySelector('form')

// formResetPwd?.addEventListener('submit', async event => {
//   event.preventDefault()

//   const response = await fetch('/api/users/resetpass', {
//     method: 'PUT',
//     // @ts-ignore
//     body: new URLSearchParams(new FormData(formResetPwd))
//   })

//   if (response.status === 200) {
//     alert('Password updated successfully')
//     window.location.href = '/login'
//   } else {
//     const error = await response.json()
//     alert(error.message)
//   }
// })

const formResetPwd = document.querySelector('form#resetPassForm');

formResetPwd?.addEventListener('submit', async event => {
  event.preventDefault();

  const response = await fetch('/api/users/resetpass', {
    method: 'POST',
    // @ts-ignore
    body: new URLSearchParams(new FormData(formResetPwd))
  });

  if (response.ok) {
    alert('Please check your email to reset your password');
  } else {
    const error = await response.json();
    alert(error.message || 'Failed to send reset email');
  }
});
