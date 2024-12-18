
        const form = document.getElementById('signupForm');
        const passwordInput = document.getElementById('exampleInputPassword1');
        const passwordHelp = document.getElementById('passwordHelp');

        form.addEventListener('submit', function (event) {
            const password = passwordInput.value;
            const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

            if (password.length < 8 || !specialCharRegex.test(password)) {
                event.preventDefault(); // Prevent form submission
                passwordHelp.style.display = 'block'; // Show the error message
                passwordInput.classList.add('is-invalid'); // Highlight the input field
            } else {
                passwordHelp.style.display = 'none';
                passwordInput.classList.remove('is-invalid');
            }
        });