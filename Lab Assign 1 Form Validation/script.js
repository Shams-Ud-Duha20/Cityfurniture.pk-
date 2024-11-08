document.getElementById('checkoutForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let formIsValid = true;

    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('emailAddress');
    const addressInput = document.getElementById('streetAddress');
    const cityInput = document.getElementById('cityName');

    if (nameInput.value.trim().length < 10 || nameInput.value.trim().length > 15) {
        nameInput.classList.add('is-invalid');
        formIsValid = false;
    } else {
        nameInput.classList.remove('is-invalid');
        nameInput.classList.add('is-valid');
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
        emailInput.classList.add('is-invalid');
        formIsValid = false;
    } else {
        emailInput.classList.remove('is-invalid');
        emailInput.classList.add('is-valid');
    }

    if (addressInput.value.trim().length < 20) {
        addressInput.classList.add('is-invalid');
        formIsValid = false;
    } else {
        addressInput.classList.remove('is-invalid');
        addressInput.classList.add('is-valid');
    }

    if (cityInput.value.trim().length < 13) {
        cityInput.classList.add('is-invalid');
        formIsValid = false;
    } else {
        cityInput.classList.remove('is-invalid');
        cityInput.classList.add('is-valid');
    }

    if (formIsValid) {
        alert('Form submitted successfully!');
    }
});
