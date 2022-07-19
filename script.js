// Sets froms with 'validate' class to not validate through HTML
let forms = document.querySelectorAll('.validate')
for (i = 0; i < forms.length; i++) {
  forms[i].setAttribute('novalidate', true);
}

// Checks that password and confirm password fields match, if not sets customError on confirm password field
function passwordMatch() {
  let password = document.getElementById('password');
  let confirm_password = document.getElementById('confirm_password');
  if (password.value === confirm_password.value) {
    confirm_password.setCustomValidity('')
  } else {
    confirm_password.setCustomValidity('Passwords must match.')
  }
}

// Accepts element and returns corresponding error message
function errorType(element) {
  if (element.disabled || element.type === 'file' || element.type === 'reset' || element.type === 'submit' || element.type === 'button') return;

  passwordMatch()

  let validity = element.validity;

  console.log(validity);

  if (validity.valid) return;

  if (validity.valueMissing) return 'Please fill out this element.';

  if (validity.typeMismatch) {
    if (element.type === 'email') return 'Please enter an email address.';

    if (element.type === 'url') return 'Please enter a URL.';

    return 'Please use the correct input type.';
  }

  if (validity.tooShort) return 'Must be at least ' + getAttribute('minLength') + ' characters';

  if (validity.tooLong) return 'Cannot be more than ' + getAttribute('maxLength') + ' characters';

  if (validity.badInput) return 'Please enter a number.';

  if (validity.stepMismatch) return 'Please select a valid value.';

  if (validity.rangeOverflow) return 'Cannot be more than ' + element.getAttribute('max') + '.';

  if (validity.rangeUnderflow) return 'Must be more than ' + element.getAttribute('min') + '.';

  if (validity.patternMismatch) {
    if (element.hasAttribute('title')) return element.getAttribute('title');

    return 'Please match the requested format.';
  }

  if (validity.customError) {
    return element.validationMessage;
  }

  return 'The value you entered for this element is invalid.';
}

// Accepts element & error message and applies classes & adds error message to the DOM to make error and styling visible
function displayError(element, error) {
  errorElement = element.nextElementSibling;
  errorElement.textContent = error;
  element.classList.add('error');
  errorElement.classList.add('error-message');
  errorElement.id = 'error-for-' + element.name;
  element.setAttribute('aria-describedby', 'error-for-' + element.name);
}

// Accepts element and checks if its valid. If so it removes error message and error styling applied by displayError()
function removeError(element) {
  errorElement = element.nextElementSibling;
  errorElement.textContent = "";
  errorElement.classList.remove('error-message');
  errorElement.removeAttribute('id');
  element.classList.remove('error');
  element.removeAttribute('aria-describedby');
}

// Accepts element and checks if its valid. If so it removes error message and error styling applied by displayError()
function checkValid(element) {
  if (!element.nodeName === "INPUT") return;

  passwordMatch();

  if (!element.validity.valid) return;

  errorElement = element.nextElementSibling

  element.classList.remove('error');
  element.classList.add('validated');
  element.removeAttribute('aria-describedby');
  errorElement.textContent = "";
  errorElement.classList.remove('error-message');
  errorElement.removeAttribute('id');
}

// Accepts form element and prevents it from submitting if it is submitted with invalid fields. Also adds error messages, error styling and focuses first invalid field
function checkForm(form) {
  if (!form.target.classList.contains('validate')) return;

  let elements = form.target.elements;

  let error, firstError;
  for (i = 0; i < elements.length; i++) {
    error = errorType(elements[i]);
    if (error) {
      displayError(elements[i], error);
      if (!firstError) {
        firstError = elements[i];
      }
    }
  }

  if (firstError) {
    form.preventDefault();
    firstError.focus();
  }
}

// Finds and displays errors in input fields when they are blurred (clicked off of)
document.addEventListener('blur', function (event) {
  if (!event.target.form.classList.contains('validate')) return;

  let error = errorType(event.target)

  if (error) {
    displayError(event.target, error);
  }

}, true);

// Checks if field is valid upon new input and if so removes error message and error styling
document.addEventListener('input', function (event) {
  checkValid(event.target);
}, false)

// Calls checkForm() when a form is submitted
document.addEventListener('submit', function (event) {
  checkForm(event);
}, false)
