$(document).ready(function () {
    let darkMode = false;
    $(".dark-mode-btn").on('click', function() {
        // Toggle dark mode
        darkMode = !darkMode;
        $("body").toggleClass("dark-mode");
        $("hr").toggleClass("dark-mode");
    });
});