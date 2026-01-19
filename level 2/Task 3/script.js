document.addEventListener('DOMContentLoaded', () => {
    // State management
    let tasks = JSON.parse(localStorage.getItem('zenTasks')) || [];
    let currentEditId = null;

    // DOM Elements
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const pendingList = document.getElementById('pendingList');
    const completedList = document.getElementById('completedList');

    // Modal Elements
    const editModal = document.getElementById('editModal');
    const editTaskInput = document.getElementById('editTaskInput');
    const saveEditBtn = document.getElementById('saveEdit');
    const cancelEditBtn = document.getElementById('cancelEdit');

    // --- Core Functions ---

    const saveTasks = () => {
        localStorage.setItem('zenTasks', JSON.stringify(tasks));
        renderTasks();
    };

    const addTask = () => {
        const text = taskInput.value.trim();
        if (text) {
            const newTask = {
                id: Date.now(),
                text: text,
                completed: false,
                createdAt: new Date().toLocaleString(),
                completedAt: null
            };
            tasks.unshift(newTask);
            taskInput.value = '';
            saveTasks();
        }
    };

    const toggleTask = (id) => {
        tasks = tasks.map(task => {
            if (task.id === id) {
                const isNowCompleted = !task.completed;
                return {
                    ...task,
                    completed: isNowCompleted,
                    completedAt: isNowCompleted ? new Date().toLocaleString() : null
                };
            }
            return task;
        });
        saveTasks();
    };

    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
    };

    const openEditModal = (id) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            currentEditId = id;
            editTaskInput.value = task.text;
            editModal.style.display = 'flex';
            editTaskInput.focus();
        }
    };

    const closeEditModal = () => {
        editModal.style.display = 'none';
        currentEditId = null;
    };

    const saveEdit = () => {
        const newText = editTaskInput.value.trim();
        if (newText && currentEditId) {
            tasks = tasks.map(task =>
                task.id === currentEditId ? { ...task, text: newText } : task
            );
            saveTasks();
            closeEditModal();
        }
    };

    const renderTasks = () => {
        pendingList.innerHTML = '';
        completedList.innerHTML = '';

        const pendingTasks = tasks.filter(t => !t.completed);
        const completedTasks = tasks.filter(t => t.completed);

        if (pendingTasks.length === 0) {
            pendingList.innerHTML = '<li class="empty-state">No pending tasks</li>';
        }

        if (completedTasks.length === 0) {
            completedList.innerHTML = '<li class="empty-state">No completed tasks yet</li>';
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';

            const taskHTML = `
                <div class="task-content">
                    <div class="task-text">${task.text}</div>
                    <div class="task-actions">
                        <button class="action-btn btn-complete" title="${task.completed ? 'Undo' : 'Complete'}" onclick="handleToggle(${task.id})">
                            <i data-lucide="${task.completed ? 'rotate-ccw' : 'check'}"></i>
                        </button>
                        <button class="action-btn btn-edit" title="Edit" onclick="handleEdit(${task.id})">
                            <i data-lucide="edit-3"></i>
                        </button>
                        <button class="action-btn btn-delete" title="Delete" onclick="handleDelete(${task.id})">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
                <div class="task-meta">
                    <span><i data-lucide="calendar" style="width:12px; height:12px; margin-right:4px"></i> Added: ${task.createdAt}</span>
                    ${task.completedAt ? `<span><i data-lucide="check-circle-2" style="width:12px; height:12px; margin-right:4px"></i> Done: ${task.completedAt}</span>` : ''}
                </div>
            `;

            li.innerHTML = taskHTML;

            if (task.completed) {
                completedList.appendChild(li);
            } else {
                pendingList.appendChild(li);
            }
        });

        // Re-initialize icons for newly added elements
        lucide.createIcons();
    };

    // --- Exposed Handlers for dynamic HTML ---
    window.handleToggle = (id) => toggleTask(id);
    window.handleDelete = (id) => deleteTask(id);
    window.handleEdit = (id) => openEditModal(id);

    // --- Event Listeners ---
    addTaskBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    saveEditBtn.addEventListener('click', saveEdit);
    cancelEditBtn.addEventListener('click', closeEditModal);

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === editModal) closeEditModal();
    });

    // Initial Render
    renderTasks();
});
