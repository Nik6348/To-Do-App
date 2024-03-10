function addTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const date = document.getElementById('taskDate').value;

    if (title.trim() == '' || description.trim() == '' || date.trim() == '') {
        alert('All fields are required');
        return;
    }

    const task = {
        title,
        description,
        date,
        status: 'todo'
    };

    const listId = `${task.status}-list`;
    const taskList = document.getElementById(listId);
    const listItem = createTaskListItem(task);
    taskList.appendChild(listItem);

    const countBadge = document.getElementById(`${task.status}-count`);
    countBadge.textContent = parseInt(countBadge.textContent) + 1;

    // Storing task in localStorage
    localStorage.setItem('task_' + title, JSON.stringify(task));

    document.getElementById('addTaskForm').reset();
    $('#addTaskModal').modal('hide');
}

function createTaskListItem(task) {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.innerHTML = `
        <span id="task-title">Title: ${task.title}</span> <br>                    
        <span id="task-description"> Description: ${task.description}</span> <br>  
        <span id="task-date">Date: ${task.date}</span>
        <div class="mt-2">
            <button class="btn btn-warning btn-sm" onclick="editTask('${task.title}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteTask(this)">Delete</button>
        </div>`;
    return listItem;
}

function editTask(title) {
    const task = JSON.parse(localStorage.getItem('task_' + title));

    document.getElementById('editTaskTitle').value = task.title;
    document.getElementById('editTaskDescription').value = task.description;
    document.getElementById('editTaskDate').value = task.date;
    document.getElementById('editTaskStatus').value = task.status;

    $('#editTaskModal').modal('show');

    const updateTaskBtn = document.getElementById('updateTaskBtn');
    updateTaskBtn.onclick = function () {
        updateTask(title, task.status);
    };
}

function updateTask(oldTitle, oldStatus) {
    const updatedTitle = document.getElementById('editTaskTitle').value;
    const updatedDescription = document.getElementById('editTaskDescription').value;
    const updatedDate = document.getElementById('editTaskDate').value;
    const updatedStatus = document.getElementById('editTaskStatus').value;

    const updatedTask = {
        title: updatedTitle,
        description: updatedDescription,
        date: updatedDate,
        status: updatedStatus;,MK
        l
    };

    if (updatedTitle.trim() == '' || updatedDescription.trim() == '' || updatedDate.trim() == '') {
        alert('All fields are required');
        return;
    }
    if (updatedStatus !== oldStatus) {
        const oldList = document.getElementById(`${oldStatus}-list`);
        const newList = document.getElementById(`${updatedStatus}-list`);

        const taskElement = findTaskElement(oldList, updatedTitle);
        if (taskElement) {
            taskElement.remove();

            const listItem = createTaskListItem(updatedTask);
            newList.appendChild(listItem);

            updateCountBadge(oldStatus);
            updateCountBadge(updatedStatus);
        }
    } else {
        const list = document.getElementById(`${updatedStatus}-list`);
        const taskElement = findTaskElement(list, oldTitle);

        if (taskElement) {
            taskElement.querySelector('#task-title').innerText = `Title: ${updatedTitle}`;
            taskElement.querySelector('#task-description').innerHTML = `Description: ${updatedDescription}`;
            taskElement.querySelector('#task-date').innerHTML = `Date: ${updatedDate}`;
        }
    }

    // Updating task in localStorage
    localStorage.setItem('task_' + updatedTitle, JSON.stringify(updatedTask));

    $('#editTaskModal').modal('hide');
}

function deleteTask(deleteButton) {
    const taskElement = deleteButton.closest('li');
    const title = taskElement.querySelector('#task-title').innerText.split(': ')[1];
    const status = taskElement.parentElement.id.split('-')[0];

    if (confirm('Are you sure you want to delete this task?')) {
        taskElement.remove();
        updateCountBadge(status);
        // Removing task from localStorage
        localStorage.removeItem('task_' + title);
    }
}

function findTaskElement(list, title) {
    const tasks = list.querySelectorAll('#task-title');
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].innerText.split(': ')[1] === title) {
            return tasks[i].closest('li');
        }
    }
    console.log('list-item not found!')
    return null;
}

function updateCountBadge(status) {
    const countBadge = document.getElementById(`${status}-count`);
    countBadge.textContent = document.getElementById(`${status}-list`).childElementCount;
}

// Retrieving tasks from localStorage on page load
window.onload = function () {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('task_')) {
            const task = JSON.parse(localStorage.getItem(key));
            const listId = `${task.status}-list`;
            const taskList = document.getElementById(listId);
            const listItem = createTaskListItem(task);
            taskList.appendChild(listItem);
            const countBadge = document.getElementById(`${task.status}-count`);
            countBadge.textContent = parseInt(countBadge.textContent) + 1;
        }
    }
};