document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Инициализация списка
    function initTasks() {
        tasks.forEach(task => createTaskElement(task));
    }

    // Создание элемента задачи
    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div class="actions">
                <button class="action-btn edit-btn" title="Редактировать">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn complete-btn" title="${task.completed ? 'Не выполнено' : 'Выполнено'}">
                    <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                </button>
                <button class="action-btn delete-btn" title="Удалить">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        // Обработчики событий
        li.querySelector('.complete-btn').addEventListener('click', toggleComplete);
        li.querySelector('.delete-btn').addEventListener('click', deleteTask);
        li.querySelector('.edit-btn').addEventListener('click', editTask);
        
        taskList.appendChild(li);
    }

    // Добавление задачи
    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            const newTask = { text, completed: false };
            tasks.push(newTask);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            createTaskElement(newTask);
            taskInput.value = '';
        }
    }

    // Переключение статуса задачи
    function toggleComplete(e) {
        const li = e.target.closest('.task-item');
        const index = Array.from(taskList.children).indexOf(li);
        tasks[index].completed = !tasks[index].completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        li.classList.toggle('completed');
        li.querySelector('.complete-btn i').className = 
            tasks[index].completed ? 'fas fa-undo' : 'fas fa-check';
    }

    // Удаление задачи
    function deleteTask(e) {
        const li = e.target.closest('.task-item');
        const index = Array.from(taskList.children).indexOf(li);
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        li.style.transform = 'translateX(100%)';
        setTimeout(() => li.remove(), 300);
    }

    // Редактирование задачи
    function editTask(e) {
        const li = e.target.closest('.task-item');
        const textSpan = li.querySelector('.task-text');
        const index = Array.from(taskList.children).indexOf(li);
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = tasks[index].text;
        input.className = 'glass-input';
        
        textSpan.replaceWith(input);
        input.focus();
        
        input.addEventListener('blur', () => {
            const newText = input.value.trim();
            if (newText) {
                tasks[index].text = newText;
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
            input.replaceWith(textSpan);
            textSpan.textContent = newText || tasks[index].text;
        });
    }

    // Обработчики событий
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    initTasks();
});
