$(document).ready(function () {
    let darkMode = false;
    $(".dark-mode-btn").on('click', function() {
        // Toggle dark mode
        darkMode = !darkMode;
        if (darkMode) {
            $(this).text("light mode! 🌞");
        } else {
            $(this).text("dark mode! 😎");
        }
        $(this).toggleClass("btn-dark")
            .toggleClass("btn-light");
        $("body").toggleClass("dark-mode");
        $("hr").toggleClass("dark-mode");
        $("input").toggleClass("dark-mode");
    });
});