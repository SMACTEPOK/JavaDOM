const COLUMNS = {
    TODO: 'todo',
    INPROGRESS: 'inprogress',
    DONE: 'done'
};

let tasks = [];
let draggedTaskId = null;
const STORAGE_KEY = 'kanban_board_tasks';
const MAX_TASK_LENGTH = 100;

const taskInput = document.getElementById('taskInput');
const columnSelect = document.getElementById('columnSelect');
const addTaskBtn = document.getElementById('addTaskBtn');
const todoList = document.getElementById('todoList');
const inprogressList = document.getElementById('inprogressList');
const doneList = document.getElementById('doneList');
const clearStorageBtn = document.getElementById('clearStorageBtn');
const saveToFileBtn = document.getElementById('saveToFileBtn');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');
const progressPercentSpan = document.getElementById('progressPercent');
const todoCountSpan = document.getElementById('todoCount');
const inprogressCountSpan = document.getElementById('inprogressCount');
const doneCountSpan = document.getElementById('doneCount');

const listsMap = {
    [COLUMNS.TODO]: todoList,
    [COLUMNS.INPROGRESS]: inprogressList,
    [COLUMNS.DONE]: doneList
};

function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadFromLocalStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                tasks = parsed;
                return;
            }
        } catch (e) {}
    }
    tasks = [
        { id: 1, text: 'Дослідити Drag-and-drop API', status: COLUMNS.TODO, createdAt: new Date().toISOString() },
        { id: 2, text: 'Реалізувати збереження в localStorage', status: COLUMNS.INPROGRESS, createdAt: new Date().toISOString() },
        { id: 3, text: 'Створити Канбан-дошку з 3 стовпцями', status: COLUMNS.DONE, createdAt: new Date().toISOString() },
        { id: 4, text: 'Додати редагування задач', status: COLUMNS.TODO, createdAt: new Date().toISOString() }
    ];
    saveToLocalStorage();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.setAttribute('data-id', task.id);
    card.setAttribute('draggable', 'true');
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'task-content';
    
    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;
    
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';
    
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.className = 'edit-task-btn';
    editBtn.title = 'Редагувати задачу';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.className = 'delete-task-btn';
    deleteBtn.title = 'Видалити задачу';
    
    actionsDiv.append(editBtn, deleteBtn);
    contentDiv.append(textSpan, actionsDiv);
    
    const dateDiv = document.createElement('div');
    dateDiv.className = 'task-date';
    dateDiv.innerHTML = `<i class="far fa-clock"></i> ${formatDate(task.createdAt)}`;
    
    card.append(contentDiv, dateDiv);
    
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        enableEditing(card, task, textSpan);
    });
    
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id);
    });
    
    textSpan.addEventListener('dblclick', () => {
        enableEditing(card, task, textSpan);
    });
    
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
    });
    
    return card;
}

function enableEditing(card, task, textSpan) {
    if (textSpan.classList.contains('editing')) return;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'task-edit-input';
    input.value = task.text;
    
    textSpan.classList.add('editing');
    textSpan.style.display = 'none';
    
    const contentDiv = card.querySelector('.task-content');
    contentDiv.insertBefore(input, textSpan.nextSibling);
    input.focus();
    
    function saveEdit() {
        const newText = input.value.trim();
        
        if (newText === '') {
            alert('Текст задачі не може бути порожнім');
            input.focus();
            return;
        }
        
        if (newText.length > MAX_TASK_LENGTH) {
            alert(`Текст задачі не може перевищувати ${MAX_TASK_LENGTH} символів. Зараз: ${newText.length}`);
            input.focus();
            return;
        }
        
        task.text = newText;
        textSpan.textContent = newText;
        saveToLocalStorage();
        
        textSpan.classList.remove('editing');
        textSpan.style.display = '';
        input.remove();
    }
    
    input.addEventListener('blur', saveEdit);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveEdit();
        }
    });
}

function handleDragStart(e) {
    const card = e.target.closest('.task-card');
    if (!card) return;
    
    const taskId = parseInt(card.getAttribute('data-id'));
    const task = tasks.find(t => t.id === taskId);
    
    if (task && task.status === COLUMNS.DONE) {
        e.preventDefault();
        e.dataTransfer.effectAllowed = 'none';
        alert('Виконану задачу не можна переміщати');
        return;
    }
    
    draggedTaskId = taskId;
    card.classList.add('dragging');
    e.dataTransfer.setData('text/plain', draggedTaskId);
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    const card = e.target.closest('.task-card');
    if (card) card.classList.remove('dragging');
    draggedTaskId = null;
    document.querySelectorAll('.task-list').forEach(list => {
        list.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
    e.preventDefault();
    const targetList = e.target.closest('.task-list');
    if (!targetList) return;
    
    const newStatus = targetList.getAttribute('data-status');
    if (!newStatus) return;
    
    if (draggedTaskId !== null) {
        moveTaskToColumn(draggedTaskId, newStatus);
    }
    
    targetList.classList.remove('drag-over');
}

function handleDragEnter(e) {
    const list = e.target.closest('.task-list');
    if (list) {
        list.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    const list = e.target.closest('.task-list');
    if (list) {
        list.classList.remove('drag-over');
    }
}

function moveTaskToColumn(taskId, newStatus) {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status === COLUMNS.DONE) {
        return;
    }
    if (task && task.status !== newStatus) {
        task.status = newStatus;
        saveToLocalStorage();
        renderAllTasks();
        updateStatistics();
    }
}

function showInputError(message) {
    taskInput.style.borderColor = '#f91880';
    const originalPlaceholder = taskInput.placeholder;
    taskInput.placeholder = `Помилка: ${message}`;
    setTimeout(() => {
        taskInput.style.borderColor = '#2f3336';
        taskInput.placeholder = originalPlaceholder;
    }, 2000);
}

function addTask() {
    const text = taskInput.value.trim();
    
    if (text === '') {
        showInputError('Введіть текст задачі');
        return;
    }
    
    if (text.length > MAX_TASK_LENGTH) {
        showInputError(`Максимум ${MAX_TASK_LENGTH} символів (зараз ${text.length})`);
        return;
    }
    
    const status = columnSelect.value;
    const newTask = {
        id: Date.now(),
        text: text,
        status: status,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveToLocalStorage();
    renderAllTasks();
    updateStatistics();
    
    taskInput.value = '';
    taskInput.focus();
}

function deleteTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const taskPreview = task.text.length > 50 ? task.text.slice(0, 50) + '...' : task.text;
    if (confirm(`Видалити задачу "${taskPreview}"?`)) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveToLocalStorage();
        renderAllTasks();
        updateStatistics();
    }
}

function clearAllTasks() {
    if (tasks.length === 0) return;
    const confirmDelete = confirm('Ви дійсно хочете видалити ВСІ задачі? Цю дію не можна скасувати.');
    if (confirmDelete) {
        tasks = [];
        saveToLocalStorage();
        renderAllTasks();
        updateStatistics();
    }
}

function exportToJSON() {
    if (tasks.length === 0) {
        alert('Немає задач для експорту');
        return;
    }
    
    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kanban_backup_${new Date().toISOString().slice(0, 19)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert(`Експортовано ${tasks.length} задач`);
}

function renderAllTasks() {
    Object.values(listsMap).forEach(list => {
        list.innerHTML = '';
    });
    
    if (tasks.length === 0) {
        Object.values(listsMap).forEach(list => {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'empty-column';
            emptyMsg.innerHTML = '<i class="far fa-folder-open"></i> Немає задач';
            list.appendChild(emptyMsg);
        });
        return;
    }
    
    tasks.forEach(task => {
        const targetList = listsMap[task.status];
        if (targetList) {
            const taskCard = createTaskCard(task);
            targetList.appendChild(taskCard);
        }
    });
    
    Object.entries(listsMap).forEach(([status, list]) => {
        if (list.children.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'empty-column';
            emptyMsg.innerHTML = '<i class="far fa-inbox"></i> Немає задач';
            list.appendChild(emptyMsg);
        }
    });
}

function updateStatistics() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === COLUMNS.DONE).length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    totalTasksSpan.textContent = total;
    completedTasksSpan.textContent = completed;
    progressPercentSpan.textContent = progress;
    
    todoCountSpan.textContent = tasks.filter(t => t.status === COLUMNS.TODO).length;
    inprogressCountSpan.textContent = tasks.filter(t => t.status === COLUMNS.INPROGRESS).length;
    doneCountSpan.textContent = completed;
}

function initDragAndDrop() {
    Object.values(listsMap).forEach(list => {
        list.addEventListener('dragover', handleDragOver);
        list.addEventListener('drop', handleDrop);
        list.addEventListener('dragenter', handleDragEnter);
        list.addEventListener('dragleave', handleDragLeave);
    });
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
clearStorageBtn.addEventListener('click', clearAllTasks);
saveToFileBtn.addEventListener('click', exportToJSON);

loadFromLocalStorage();
initDragAndDrop();
renderAllTasks();
updateStatistics();