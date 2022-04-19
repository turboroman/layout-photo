document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contacts-form');

  const inputName = document.querySelector('#name');
  const errorMessageName = document.querySelector('.contacts-form__error-message--name');

  const inputMail = document.querySelector('#mail');
  const errorMessageMail = document.querySelector('.contacts-form__error-message--mail');

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    if (inputName.value.match(/[\d.,\/#!$%\^&\*;:{}=\-_`~()]/)) {
      errorMessageName.style.display = 'block';
      inputName.style.borderColor = '#FF3030';
    }
    if (inputMail.value.match(/[^а-яА-Я\s-]/)) {
      errorMessageMail.style.display = 'block';
      inputMail.style.borderColor = '#FF3030';
    }
  })

  inputName.addEventListener('blur', function () {
    errorMessage.style.display = 'none';
    inputName.style.borderColor = 'transparent';
  })
  
  inputMail.addEventListener('blur', function () {
    errorMessage.style.display = 'none';
    inputName.style.borderColor = 'transparent';
  })
})
