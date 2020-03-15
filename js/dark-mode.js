$(document).ready(function () {
    let darkMode = false;
    $(".dark-mode-btn").on('click', function() {
        if (!darkMode) {
            darkMode = true;
        } else {
            darkMode = false;
        }
    });
});