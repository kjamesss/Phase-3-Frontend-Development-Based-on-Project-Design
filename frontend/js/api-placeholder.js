// Phase 3 submit boundary. Replace each form's placeholder with a Fetch request
// to its Express route when the API is ready. The server will validate input,
// resolve the current user and ownership, enforce roles, and hash passwords.
document.querySelectorAll('form[data-api-placeholder]').forEach(form => {
    form.addEventListener('submit', event => {
        event.preventDefault();
        const feedback = form.querySelector('[role="status"]');
        feedback.classList.remove('d-none');
        feedback.textContent = 'Preview only. This action requires an API connection.';
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
