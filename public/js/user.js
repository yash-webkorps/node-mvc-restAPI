const nameInput = document.getElementById('name')
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

async function signup(e) {
    e.preventDefault();
    try {
        // Check if any input fields are blank
        if (!nameInput.value || !emailInput.value || !passwordInput.value) {
            alert('Please fill out all fields.');
            return;
        }
        
        const signupDetails = {
            name: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value
        }

        const res = await axios.post('/signup', signupDetails)
        alert(res.data.message)

        window.location.href = '/login'
    } catch (err) {
        if (err.response && (err.response.status === 400 || err.response.status === 409 || err.response.status === 500)) {
            alert(err.response.data.error);
        } else {
            console.log(err);
            alert('An error occurred.');
        } 
    }
}
async function login(e) {
    e.preventDefault();
    try {

        // Check if any input fields are blank
        if (!emailInput.value || !passwordInput.value) {
            alert('Please fill out all fields.');
            return;
        }

        const loginDetails = {
            email: emailInput.value,
            password: passwordInput.value
        }

        const res = await axios.post('/login', loginDetails)

        localStorage.setItem('token', res.data.token)

        const decodedToken = parseJwt(res.data.token)
        alert(`Hi, ${decodedToken.name}`);

        window.location.href = '/todo'
    } catch (err) {
        if (err.response && (err.response.status === 400 || err.response.status === 401 || err.response.status === 409 || err.response.status === 500)) {
            alert(err.response.data.error);
        } else {
            alert('An error occurred.');
        } 
    }
}