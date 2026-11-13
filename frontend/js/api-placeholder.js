// Phase 3 submit boundary. Replace each form's placeholder with a Fetch request
// to its Express route when the API is ready. The server will validate input,
// resolve the current user and ownership, enforce roles, and hash passwords.
const formActions = {
    login: 'Logging in',
    register: 'Creating an account',
    profile: 'Saving your profile',
    'create-task': 'Creating this task',
    'edit-task': 'Saving these task changes',
    'delete-task': 'Deleting this task',
    'create-category': 'Adding this subject',
    'edit-account': 'Saving this account',
    'delete-account': 'Deleting this account'
};

document.querySelectorAll('form[data-api-placeholder]').forEach(form => {
    form.querySelectorAll('input[type="text"][required]').forEach(input => {
        input.pattern = '.*\\S.*';
        input.title = 'Enter at least one visible character.';
    });
    form.addEventListener('submit', event => {
        event.preventDefault();
        const feedback = form.querySelector('[role="status"]');
        feedback.classList.remove('d-none');
        feedback.textContent = formActions[form.id] + ' requires an API connection. You can continue exploring the sample data.';
        feedback.tabIndex = -1;
        feedback.focus();
        const password = form.querySelector('input[type="password"]');
        if (password) password.value = '';
    });

    form.closest('.modal')?.addEventListener('hidden.bs.modal', () => {
        form.reset();
        const feedback = form.querySelector('[role="status"]');
        feedback.textContent = '';
        feedback.classList.add('d-none');
    });
});
