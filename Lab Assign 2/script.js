const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const apiUrl = 'https://fakestoreapi.com/products';


function fetchTasks() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(tasks => renderTasks(tasks.slice(0, 9))); 
}


function renderTasks(tasks) {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = createTaskElement(task);
    taskList.appendChild(li);
  });
}


function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'list-group-item d-flex justify-content-between align-items-center';
  li.setAttribute('data-id', task.id);
  li.innerHTML = `
    <span>${task.title}</span>
    <div>
      <button class="btn btn-warning btn-sm" onclick="editTask(${task.id})">Edit</button>
      <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Delete</button>
    </div>
  `;
  return li;
}


taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newTask = {
    title: taskInput.value,
    description: "A new task",
    price: 0,
    image: "https://via.placeholder.com/150"
  };

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newTask)
  })
  .then(response => response.json())
  .then(task => {
    const newTaskElement = createTaskElement(task);
    taskList.appendChild(newTaskElement); 
    taskInput.value = ''; 
  });
});


function editTask(id) {
  const newTitle = prompt("Enter new title for the task:");
  if (newTitle) {
    fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: newTitle })
    })
    .then(response => response.json())
    .then(updatedTask => {
      const taskElement = document.querySelector(`li[data-id='${id}']`);
      if (taskElement) {
        taskElement.querySelector('span').textContent = updatedTask.title; 
      }
      alert(`Task ${id} updated!`);
    });
  }
}


function deleteTask(id) {
  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE'
  })
  .then(() => {
    const taskElement = document.querySelector(`li[data-id='${id}']`);
    if (taskElement) {
      taskElement.remove(); 
    }
    alert(`Task ${id} deleted!`);
  });
}

fetchTasks();
