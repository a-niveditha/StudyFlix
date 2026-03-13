const TODO_STORAGE_KEY = 'studyflix-todos';
let todos = [];

document.addEventListener('DOMContentLoaded', () => {
  loadTodos();
  renderTodos();

  document.getElementById('add-todo-btn').addEventListener('click', addTodo);
  document.getElementById('todo-text').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
  });

  document.getElementById('back-notes-btn').addEventListener('click', () => {
    window.location.href = 'notes.html';
  });
});

function loadTodos() {
  const stored = sessionStorage.getItem(TODO_STORAGE_KEY);
  if (stored) {
    try {
      todos = JSON.parse(stored);
    } catch (e) {
      todos = [];
    }
  } else {
    todos = [];
  }
}

function saveTodos() {
  sessionStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}

function renderTodos() {
  const list = document.getElementById('todo-list');
  list.innerHTML = '';

  if (!todos.length) {
    list.innerHTML = '<div class="empty-state">No to-dos yet. Add one above!</div>';
    return;
  }

  todos.forEach(todo => {
    const row = document.createElement('div');
    row.className = 'todo-item';
    if (todo.done) row.classList.add('done');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.addEventListener('change', () => {
      todo.done = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.value = todo.text;
    textInput.addEventListener('blur', () => {
      todo.text = textInput.value.trim();
      saveTodos();
    });

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.value = todo.due || '';
    dateInput.addEventListener('change', () => {
      todo.due = dateInput.value;
      saveTodos();
    });

    const actions = document.createElement('div');
    actions.className = 'actions';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      todos = todos.filter(t => t.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    actions.appendChild(deleteBtn);

    row.appendChild(checkbox);
    row.appendChild(textInput);
    row.appendChild(dateInput);
    row.appendChild(actions);

    list.appendChild(row);
  });
}

function addTodo() {
  const textEl = document.getElementById('todo-text');
  const dueEl = document.getElementById('todo-due');
  const text = textEl.value.trim();
  const due = dueEl.value;

  if (!text) return;

  todos.unshift({
    id: generateId(),
    text,
    due,
    done: false,
    createdAt: Date.now()
  });

  saveTodos();
  renderTodos();

  textEl.value = '';
  dueEl.value = '';
}

function generateId() {
  return 'todo-' + Math.random().toString(16).slice(2) + Date.now();
}
