$(document).ready(function () {
    let MODE_TOGGLING_ELEMENTS = ['body', 'hr', 'input'];
    let mode = localStorage.getItem("mode");
    updateMode();

    $(".dark-mode-btn").on('click', function () {
        // Toggle dark mode
        localStorage.setItem("mode", mode == 'light' ? 'dark' : 'light');
        updateMode();
    });

    /**
     * Update mode (Dark/Light) based on the mode
     */
    function updateMode() {
        let $darkModeBtn = $(".dark-mode-btn");
        mode = localStorage.getItem("mode");
        console.log(mode)
        if (mode == 'dark') {
            $darkModeBtn.text("light mode! 🌞");
            $darkModeBtn.removeClass("btn-dark")
                .addClass("btn-light");
            $("body").addClass("dark-mode");
            $("hr").addClass("dark-mode");
            $("input").addClass("dark-mode");
        } else {
            $darkModeBtn.text("dark mode! 😎");
            $darkModeBtn.removeClass("btn-light")
                .addClass("btn-dark");
            $("body").removeClass("dark-mode");
            $("hr").removeClass("dark-mode");
            $("input").removeClass("dark-mode");
        }
    }
});