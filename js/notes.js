document.addEventListener('DOMContentLoaded', function () {
    const notepad = document.getElementById('notepad');
    const saveNotesButton = document.getElementById('saveNotesButton');
    const saveStatus = document.getElementById('saveStatus');

    if (localStorage.getItem('notepadContent')) {
        notepad.value = localStorage.getItem('notepadContent');
    }

    saveNotesButton.addEventListener('click', function () {
        localStorage.setItem('notepadContent', notepad.value);
        saveStatus.textContent = 'Notes saved!';
        setTimeout(() => { saveStatus.textContent = ''; }, 2000);
    });
});
