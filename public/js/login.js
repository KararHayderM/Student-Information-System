
const element_username = document.getElementById('username');
const element_password = document.getElementById('password');
const errorDiv = document.getElementById('errorMessage');


if (localStorage.getItem('sis_user')) {
    window.location.href = 'index.html';
    }

document.getElementById('loginForm').addEventListener('submit', async function (e) {

    const username = element_username.value.trim()
    const password = element_password.value.trim()

    e.preventDefault();

    errorDiv.style.display = 'none';
    errorDiv.textContent = '';

    if (username && password) {
        try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            localStorage.setItem('sis_user', username);
            window.location.href = 'index.html';
        } else {
            const errorText = await response.text();
            errorDiv.textContent = errorText || 'اسم المستخدم او كلمة المرور خاطئة';
            errorDiv.style.display = 'block';
        }
        } catch (err) {
        errorDiv.textContent = 'لايمكن الوصول الى السيرفر';
        errorDiv.style.display = 'block';
        }
    } else {
        errorDiv.textContent = 'ادخل اسم المستخدم و كلمة المرور';
        errorDiv.style.display = 'block';
        console.log("password:", password, " username:", username)
    }
    });