// Fictional records for the Phase 3 interface. Dates are relative to today so
// the dashboard continues to demonstrate upcoming and overdue deadlines.
const studentId = '6914a2d60000000000000101';
const otherStudentId = '6914a2d60000000000000102';
const people = [
    { _id: studentId, name: 'Alex Reyes', email: 'alex.reyes@example.test', role: 'user' },
    { _id: otherStudentId, name: 'Sam Villanueva', email: 'sam.villanueva@example.test', role: 'user' },
    { _id: '6914a2d60000000000000103', name: 'Casey Santos', email: 'casey.santos@example.test', role: 'admin' }
];
const categories = {
    '6914a2d60000000000000001': { name: 'Web Systems and Technologies', color: '#2563eb' },
    '6914a2d60000000000000002': { name: 'Database Management', color: '#0f766e' },
    '6914a2d60000000000000003': { name: 'Systems Analysis and Design', color: '#7c3aed' }
};
const [web, database, systems] = Object.keys(categories);

function dateAt(offset) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0')].join('-');
}

const tasks = [
    ['Prepare requirements matrix', 'Match interview notes to system requirements.', -3, 'High', 'In Progress', systems],
    ['Read chapter notes', 'Review the assigned reading before class.', -1, 'Low', 'To Do', ''],
    ['Submit dashboard wireframes', 'Include desktop and mobile layouts.', 1, 'High', 'To Do', web],
    ['Review SQL joins', 'Practice inner and left joins using the lab data.', 3, 'Medium', 'In Progress', database],
    ['Draft ERD field notes', 'Record required fields and optional references.', 6, 'Medium', 'To Do', database],
    ['Outline case study', 'Summarize the scenario and main stakeholders.', -2, 'Low', 'Completed', systems],
    ['Practice form validation', 'Prepare examples for the next lab.', 4, 'Medium', 'To Do', web],
    ['Update the data dictionary', 'Check field definitions for consistency.', 5, 'Low', 'Completed', database]
].map(([title, description, offset, priority, status, category], index) => ({
    _id: '6914a2d6000000000000020' + (index + 1),
    title, description, dueDate: dateAt(offset), priority, status, category,
    owner: index < 6 ? studentId : otherStudentId
}));
const myTasks = tasks.filter(task => task.owner === studentId);
const statusClass = { 'To Do': 'todo', 'In Progress': 'progress-tag', Completed: 'completed' };
const dateFormat = new Intl.DateTimeFormat('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
const byDate = (a, b) => a.dueDate.localeCompare(b.dueDate);

function html(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
}

function showDate(date) {
    return dateFormat.format(new Date(date + 'T00:00:00'));
}

function deadlineLabel(task) {
    if (task.status === 'Completed') return 'Completed';
    if (task.dueDate < dateAt(0)) return 'Overdue';
    if (task.dueDate === dateAt(0)) return 'Due today';
    if (task.dueDate === dateAt(1)) return 'Due tomorrow';
    return 'Upcoming';
}

function subjectName(task) {
    return categories[task.category]?.name || 'Uncategorized';
}

function statusChip(status) {
    return '<span class="chip ' + statusClass[status] + '">' + html(status) + '</span>';
}

function priorityText(priority) {
    return '<span class="fw-semibold priority-' + priority.toLowerCase() + '">' + html(priority) + '</span>';
}

function action(label, dialog, id, kind = 'secondary') {
    return '<button type="button" class="btn btn-sm btn-outline-' + kind +
        '" data-bs-toggle="modal" data-bs-target="#' + dialog + '-modal" data-record-id="' +
        id + '" aria-label="' + label + '">' + label.split(' ')[0] + '</button>';
}

function renderDashboard() {
    const summary = document.querySelector('#task-summary');
    if (!summary) return;

    summary.innerHTML = Object.keys(statusClass).map(status =>
        '<div class="col-4 summary-cell"><strong>' + myTasks.filter(task => task.status === status).length +
        '</strong><span>' + status + '</span></div>').join('');

    const today = dateAt(0);
    const week = dateAt(7);
    const incomplete = myTasks.filter(task => task.status !== 'Completed');
    const upcoming = incomplete.filter(task => task.dueDate >= today && task.dueDate <= week);
    const overdue = incomplete.filter(task => task.dueDate < today);

    function showDeadlines(selector, records, late) {
        document.querySelector(selector).innerHTML = records.sort(byDate).map(task =>
            '<div class="deadline-item"><div><a href="tasks.html?q=' + encodeURIComponent(task.title) + '">' +
            html(task.title) + '</a><small>' + html(subjectName(task)) + '</small></div><time datetime="' +
            task.dueDate + '" class="deadline-date ' + (late ? 'overdue-date' : '') + '">' +
            showDate(task.dueDate) + '<small>' + deadlineLabel(task) + '</small></time></div>').join('') ||
            '<p class="empty-state">No ' + (late ? 'overdue tasks.' : 'deadlines in the next seven days.') + '</p>';
    }
    showDeadlines('#upcoming-list', upcoming, false);
    showDeadlines('#overdue-list', overdue, true);
}

function renderTaskList() {
    const form = document.querySelector('#task-filters');
    if (!form) return;

    const list = document.querySelector('#task-list');
    const count = document.querySelector('#task-count');
    const search = new URLSearchParams(window.location.search).get('q');
    form.elements.q.value = search || '';

    function render() {
        const { q, status, priority, category } = Object.fromEntries(new FormData(form));
        const keyword = q.trim().toLowerCase();
        const matches = myTasks.filter(task =>
            (!keyword || (task.title + ' ' + task.description + ' ' + subjectName(task)).toLowerCase().includes(keyword)) &&
            (!status || task.status === status) && (!priority || task.priority === priority) &&
            (!category || (task.category || 'uncategorized') === category)).sort(byDate);

        count.textContent = matches.length + ' of ' + myTasks.length + ' tasks';
        list.innerHTML = matches.map(task => {
            const subject = categories[task.category];
            return '<article class="task-row" data-task="' + task._id + '"><div><h3>' + html(task.title) +
                '</h3><div class="task-subject">' +
                (subject ? '<span class="subject-dot" style="background:' + subject.color + '" aria-hidden="true"></span>' : '') +
                html(subjectName(task)) + '</div><p>' + html(task.description) + '</p></div><div><time datetime="' +
                task.dueDate + '">' + showDate(task.dueDate) + '</time><small class="deadline-hint ' +
                (deadlineLabel(task) === 'Overdue' ? 'overdue-date' : '') + '">' + deadlineLabel(task) + '</small><p>' + priorityText(task.priority) +
                '</p></div><div>' + statusChip(task.status) + '</div><div class="action-row">' +
                action('Edit task', 'edit-task', task._id) + action('Delete task', 'delete-task', task._id, 'danger') +
                '</div></article>';
        }).join('') || '<p class="empty-state">No matching tasks. Try clearing a filter.</p>';
    }

    form.addEventListener('input', render);
    form.addEventListener('submit', event => { event.preventDefault(); render(); });
    form.addEventListener('reset', event => {
        event.preventDefault();
        [...form.elements].forEach(control => { control.value = ''; });
        render();
    });
    render();
}

function renderAdmin() {
    const accounts = document.querySelector('#admin-accounts');
    if (!accounts) return;

    accounts.innerHTML = people.map(person =>
        '<tr><td class="fw-semibold">' + html(person.name) + '</td><td>' + html(person.email) +
        '</td><td>' + (person.role === 'admin' ? 'Administrator' : 'Student') +
        '</td><td><div class="table-actions">' + action('Edit account', 'edit-account', person._id) +
        action('Delete account', 'delete-account', person._id, 'danger') + '</div></td></tr>').join('');

    document.querySelector('#admin-tasks').innerHTML = [...tasks].sort(byDate).map(task =>
        '<tr data-task="' + task._id + '"><td class="fw-semibold">' + html(task.title) + '</td><td>' +
        html(people.find(person => person._id === task.owner).name) + '</td><td>' + showDate(task.dueDate) +
        '</td><td>' + priorityText(task.priority) + '</td><td>' + statusChip(task.status) + '</td></tr>').join('');
}

function bindRecordDialog(id, records, fields, label) {
    const modal = document.querySelector('#' + id + '-modal');
    modal?.addEventListener('show.bs.modal', event => {
        const record = records.find(item => item._id === event.relatedTarget?.dataset.recordId);
        if (!record) return;
        const form = modal.querySelector('form');
        fields.forEach(key => { form.elements.namedItem(key).value = record[key]; });
        const title = form.querySelector('[data-record-title]');
        if (title) title.textContent = record[label];
    });
}

renderDashboard();
renderTaskList();
renderAdmin();
bindRecordDialog('edit-task', myTasks, ['_id', 'title', 'description', 'dueDate', 'priority', 'status', 'category']);
bindRecordDialog('delete-task', myTasks, ['_id'], 'title');
bindRecordDialog('edit-account', people, ['_id', 'name', 'email', 'role']);
bindRecordDialog('delete-account', people, ['_id'], 'name');
