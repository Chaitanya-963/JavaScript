const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');

const createTaskCard = (text) => {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.setAttribute('draggable', 'true');
    card.dataset.id = Date.now().toString();

    
    const span = document.createElement('span'); 
    span.textContent = text;

    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = '❌';
    del.addEventListener('click', function () {
        card.remove();
        updateCount();
        saveToStorage(); 
    });

    card.appendChild(span);
    card.appendChild(del);
    addDragEvents(card);
    return card;
};

const addTask = () => {
    const text = taskInput.value.trim();
    if (!text) return;
    const card = createTaskCard(text);
    document.getElementById('todo-list').appendChild(card);
    taskInput.value = '';
    updateCount();
    saveToStorage();
};

const updateCount = () => {
    ['todo', 'progress', 'done'].forEach((col) => {
        const count = document.getElementById(`${col}-list`).children.length;
        document.getElementById(`${col}-count`).textContent = count;
    });
};

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
});

let draggedCard = null;

function addDragEvents(card) {
    card.addEventListener('dragstart', () => {
        draggedCard = card;
        card.classList.add('dragging');
    });
    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        draggedCard = null;
    });
}

document.querySelectorAll('.column').forEach((col) => {
    col.addEventListener('dragover', (e) => {
        e.preventDefault();
        col.classList.add('drag-over');
    });
    col.addEventListener('dragleave', () => {
        col.classList.remove('drag-over');
    });
    col.addEventListener('drop', () => {
        col.classList.remove('drag-over');
        if (!draggedCard) return;
        const listId = col.dataset.column + '-list';
        document.getElementById(listId).appendChild(draggedCard);
        updateCount();
        saveToStorage(); 
    });
});

function saveToStorage() {
    const data = {};
    ['todo', 'progress', 'done'].forEach(col => {
        const list = document.getElementById(`${col}-list`);
        
        data[col] = [...list.children].map(card => card.querySelector('span')?.textContent || ""); 
    });
    localStorage.setItem('kanban', JSON.stringify(data));
}

function loadFromStorage() {
    const raw = localStorage.getItem('kanban');
    if (!raw) {
        updateCount();
        return;
    }
    const data = JSON.parse(raw);
    ['todo', 'progress', 'done'].forEach(col => {
        const list = document.getElementById(`${col}-list`);
        (data[col] || []).forEach(text => {
            const card = createTaskCard(text);
            list.appendChild(card);
        });
    });
    updateCount(); 
}


loadFromStorage(); 
