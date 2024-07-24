const token = localStorage.getItem('token')

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await axios.get(`/getTasks`, {headers: {'auth': token}});

        for (const task of res.data) {
            showOnScreen(task.taskText)
        }
    } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 404 || err.response.status === 500)) {
            alert(err.response.data.error);
        } else {
            alert('An error occurred.');
        }
        window.location.href = '/login'
    }
})

async function addTask() {
    try {
        const taskInput = document.getElementById('taskInput');
        const taskText = taskInput.value.trim();
        if (!taskText) {
            alert('Please enter a task.');
            return;
        }

        const taskDetails = {
            taskText: taskText
        }

        const res = await axios.post('/addTask', taskDetails,  {headers: {'auth': token}});
        alert(res.data.message)
        window.location.href = '/todo'
    } catch (err) {
        console.log(err);
        if (err.response && (err.response.status === 400 || err.response.status === 409 || err.response.status === 500)) {
            alert(err.response.data.error);
        } else {
            alert('An error occurred.');
        } 
    }

}
async function deleteTask(taskText) {
    try {
        const res = await axios.delete(`/deleteTask?taskText=${taskText}`,  {headers: {'auth': token}})
        alert(res.data.message)
        window.location.href = '/todo'
    } catch (err) {
        if (err.response && (err.response.status === 400 || err.response.status === 500)) {
            alert(err.response.data.error);
        } else {
            alert('An error occurred.');
        } 
    }
}
async function updateTask() {
    try {
        const taskText = localStorage.getItem('taskText')
        const updatedTaskInput = document.getElementById('updatedTaskInput');
        const updatedTaskText = updatedTaskInput.value.trim();
        if (!updatedTaskText) {
            alert('Please enter a task.');
            return;
        }

        const updatedTaskDetails = {
            taskText: taskText,
            updatedTaskText: updatedTaskText
        }

        const res = await axios.put(`/updateTask`, updatedTaskDetails, {headers: {'auth': token}})
        alert(res.data.message)
        window.location.href = '/todo'
    } catch (err) {
        if (err.response && (err.response.status === 400 || err.response.status === 500)) {
            alert(err.response.data.error);
        } else {
            alert('An error occurred.');
        } 
    }
}
async function showUpdateForm(taskText) {
    try {
        localStorage.setItem('taskText', taskText)
        const container = document.getElementsByClassName('container')[0]
        const updateContainer = document.getElementsByClassName('update-container')[0]
        container.style.display = 'none'
        updateContainer.style.display = 'block'
    } catch (error) {
        console.log(error);
        alert("Something went wrong!")
    }
}
function showOnScreen(taskText) {
    const taskList = document.getElementById('taskList');

    const li = document.createElement('li') ;
    li.textContent = taskText;

    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.className = 'updateButton';
    updateButton.addEventListener('click', ()=>{
        if (li.firstChild && li.firstChild.textContent) {
            showUpdateForm(li.firstChild.textContent);
        } else {
            console.error('li.firstChild is null or has no text content');
        }
    });

    li.appendChild(updateButton);


    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'deleteButton';
    deleteButton.addEventListener('click', ()=>{
        deleteTask(li.firstChild.textContent)
    });

    li.appendChild(deleteButton);
    li.addEventListener('click', function () {
        li.classList.toggle('completed');
    });

    taskList.appendChild(li);
    // taskInput.value = '';
}