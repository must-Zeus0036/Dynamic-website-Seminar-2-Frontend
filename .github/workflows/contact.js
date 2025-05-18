document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const confirmCheckbox = document.getElementById('confirm');
    const submitBtn = document.getElementById('submitBtn');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const confirmError = document.getElementById('confirmError');

    function validateName() {
        if (/\d/.test(nameInput.value)) {
            nameError.textContent = 'Name cannot contain numbers.';
            return false;
        } else {
            nameError.textContent = '';
            return true;
        }
    }

    function validateEmail() {
        if (!/@/.test(emailInput.value) || !/\./.test(emailInput.value)) {
            emailError.textContent = 'Invalid email format.';
            return false;
        } else {
            emailError.textContent = '';
            return true;
        }
    }

    function validateConfirm() {
        if (!confirmCheckbox.checked) {
            confirmError.textContent = 'Please confirm to send.';
            return false;
        } else {
            confirmError.textContent = '';
            return true;
        }
    }

    function enableSubmit() {
        submitBtn.disabled = !confirmCheckbox.checked;
    }

    nameInput.addEventListener('input', validateName);
    emailInput.addEventListener('input', validateEmail);
    confirmCheckbox.addEventListener('change', () => {
        validateConfirm();
        enableSubmit();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isConfirmValid = validateConfirm();

        if (isNameValid && isEmailValid && isConfirmValid) {
            // Simulate form submission
            alert('Form submitted successfully!');
            form.reset();
            enableSubmit();
        }
    });

    enableSubmit();
});