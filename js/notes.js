const STORAGE_KEY_NOTES = 'studyflix-notes';
let notes = [];
let currentEditId = null;

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initToolbar();
  initModal();
  loadNotes();
  renderNotes();
});

function initNav() {
  document.querySelectorAll('.nav-links li').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.nav-links li').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

function initToolbar() {
  document.getElementById('todo-page-btn').addEventListener('click', () => {
    window.location.href = 'todo.html';
  });

  const addBtn = document.getElementById('add-note-btn');
  const subjectInput = document.getElementById('new-note-subject');
  const moduleInput = document.getElementById('new-note-module');

  const createNoteFromInputs = () => {
    const subject = subjectInput.value.trim();
    const module = moduleInput.value.trim();
    if (!subject || !module) return;

    notes.unshift({
      id: generateId(),
      subject,
      module,
      content: '',
      pinned: true,
      createdAt: Date.now()
    });

    saveNotes();
    subjectInput.value = '';
    moduleInput.value = '';
    renderNotes(getSelectedSubject());
  };

  addBtn.addEventListener('click', createNoteFromInputs);
  subjectInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') createNoteFromInputs();
  });
  moduleInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') createNoteFromInputs();
  });

  document.getElementById('subject-filter').addEventListener('change', (e) => {
    renderNotes(e.target.value);
  });
}

function initModal() {
  const modal = document.getElementById('note-modal');
  const closeBtn = document.querySelector('.close');
  const saveBtn = document.getElementById('save-note');
  const cancelBtn = document.getElementById('cancel-note');
  const textarea = document.getElementById('note-textarea');

  closeBtn.onclick = () => { modal.style.display = 'none'; };
  cancelBtn.onclick = () => { modal.style.display = 'none'; };

  saveBtn.onclick = () => {
    if (!currentEditId) return;
    const note = notes.find(n => n.id === currentEditId);
    if (!note) return;
    note.content = textarea.value;
    saveNotes();
    renderNotes(getSelectedSubject());
    modal.style.display = 'none';
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}

function loadNotes() {
  const stored = sessionStorage.getItem(STORAGE_KEY_NOTES);
  if (stored) {
    try {
      notes = JSON.parse(stored);
    } catch (e) {
      notes = [];
    }
  } else {
    notes = [];
  }
}

function saveNotes() {
  sessionStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
}

function renderNotes(filterSubject = 'all') {
  updateSubjectFilterOptions();

  const pinnedContainer = document.getElementById('pinned-notes');
  const otherContainer = document.getElementById('other-notes');

  const filtered = notes.filter(n => filterSubject === 'all' || n.subject === filterSubject);
  const pinned = filtered.filter(n => n.pinned);
  const others = filtered.filter(n => !n.pinned);

  renderNotesList(pinnedContainer, pinned);
  renderNotesList(otherContainer, others);
}

function updateSubjectFilterOptions() {
  const select = document.getElementById('subject-filter');
  const current = getSelectedSubject();

  const subjects = [...new Set(notes.map(n => n.subject))].sort();
  select.innerHTML = '<option value="all">All subjects</option>' +
    subjects.map(s => `<option value="${s}">${s}</option>`).join('');

  if ([...select.options].some(opt => opt.value === current)) {
    select.value = current;
  }
}

function getSelectedSubject() {
  return document.getElementById('subject-filter')?.value || 'all';
}

function renderNotesList(container, noteList) {
  container.innerHTML = '';
  if (noteList.length === 0) {
    container.innerHTML = '<div class="empty-state">No notes here</div>';
    return;
  }
  noteList.forEach(note => container.appendChild(createNoteCard(note)));
}

function createNoteCard(note) {
  const card = document.createElement('article');
  card.className = 'note-card';

  const header = document.createElement('div');
  header.className = 'card-header';

  const title = document.createElement('div');
  title.className = 'card-subject-title';
  title.textContent = note.subject;

  const sub = document.createElement('div');
  sub.className = 'card-subject-sub';
  sub.textContent = note.module;

  const actions = document.createElement('div');
  actions.className = 'card-actions';

  const pinBtn = document.createElement('button');
  pinBtn.className = 'card-action-btn';
  pinBtn.textContent = note.pinned ? 'Unpin' : 'Pin';
  pinBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    note.pinned = !note.pinned;
    saveNotes();
    renderNotes(getSelectedSubject());
  });

  const delBtn = document.createElement('button');
  delBtn.className = 'card-action-btn delete';
  delBtn.textContent = 'Delete';
  delBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notes = notes.filter(n => n.id !== note.id);
    saveNotes();
    renderNotes(getSelectedSubject());
  });

  actions.appendChild(pinBtn);
  actions.appendChild(delBtn);

  header.appendChild(title);
  header.appendChild(sub);
  header.appendChild(actions);

  const divider = document.createElement('div');
  divider.className = 'card-divider';

  const content = document.createElement('div');
  content.className = 'card-content';
  content.textContent = note.content;
  content.addEventListener('click', () => openEditModal(note.id));

  card.appendChild(header);
  card.appendChild(divider);
  card.appendChild(content);

  return card;
}

function openEditModal(noteId) {
  currentEditId = noteId;
  const note = notes.find(n => n.id === noteId);
  if (!note) return;
  document.getElementById('note-textarea').value = note.content;
  document.getElementById('note-modal').style.display = 'block';
}

function generateId() {
  return 'note-' + Math.random().toString(16).slice(2) + Date.now();
}
