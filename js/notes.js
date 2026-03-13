// To-do functionality
let todos = [];

document.addEventListener('DOMContentLoaded', function() {
  loadTodos();

  document.getElementById('add-todo-btn').addEventListener('click', addTodo);
  document.getElementById('new-todo-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addTodo();
  });

  // Load note contents
  loadNotes();

  // Modal functionality
  const modal = document.getElementById('note-modal');
  const closeBtn = document.querySelector('.close');
  const saveBtn = document.getElementById('save-note');
  const cancelBtn = document.getElementById('cancel-note');
  const textarea = document.getElementById('note-textarea');

  let currentNoteId = null;

  window.editNote = function(id) {
    currentNoteId = id;
    const content = localStorage.getItem('note-' + id) || '';
    textarea.value = content;
    modal.style.display = 'block';
  };

  closeBtn.onclick = function() {
    modal.style.display = 'none';
  };

  cancelBtn.onclick = function() {
    modal.style.display = 'none';
  };

  saveBtn.onclick = function() {
    const content = textarea.value;
    localStorage.setItem('note-' + currentNoteId, content);
    document.querySelector('.card-content[onclick*="\'' + currentNoteId + '\'"]').textContent = content;
    modal.style.display = 'none';
  };

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };

  // Navbar functionality (existing)
  document.querySelectorAll('.nav-links li').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.nav-links li').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
});

function loadTodos() {
  const stored = localStorage.getItem('todos');
  if (stored) {
    todos = JSON.parse(stored);
  } else {
    // Default todos
    todos = [
      { text: 'Submit DA', checked: true },
      { text: 'Make Notes', checked: false },
      { text: 'Prepare Mod 1 of CAO', checked: false }
    ];
  }
  renderTodos();
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  const list = document.getElementById('todo-list');
  list.innerHTML = '';
  todos.forEach((todo, index) => {
    const item = document.createElement('div');
    item.className = 'todo-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.checked;
    checkbox.addEventListener('change', () => {
      todos[index].checked = checkbox.checked;
      saveTodos();
    });

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;
    text.contentEditable = true;
    text.addEventListener('blur', () => {
      todos[index].text = text.textContent.trim();
      saveTodos();
    });
    text.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        text.blur();
      }
    });

    item.appendChild(checkbox);
    item.appendChild(text);
    list.appendChild(item);
  });
}

function addTodo() {
  const input = document.getElementById('new-todo-input');
  const text = input.value.trim();
  if (text) {
    todos.push({ text, checked: false });
    saveTodos();
    renderTodos();
    input.value = '';
  }
}

function loadNotes() {
  ['dsa', 'cao'].forEach(id => {
    const content = localStorage.getItem('note-' + id) || '';
    document.querySelector('.card-content[onclick*="\'' + id + '\'"]').textContent = content;
  });
}