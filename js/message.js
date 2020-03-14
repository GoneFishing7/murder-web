/**
 * Send an alert
 * @param {string} theme - The theme; Can be "Primary" (blue), "Secondary" (gray), "Success" (green), "Danger" (red), "Warning" (yellow), "Info" (light greenish blue), "Light" (light gray), or "Dark" (black) 
 * @param {string} bold - The bold text, like **OH NO!** lorem ipsum...
 * @param {string} body - The body of the alert, like  **oh no** LOREM IPSUM...
 */
function message(theme, bold, body) {
	$("main")
		.prepend("<div class='alert alert-" + theme.toLowerCase() +
			"' id='alert' role='alert' style='display: none;'><strong>" + bold + "</strong> " + body +
			"</div>");
	$("#alert").slideDown("slow");
	$("#alert").fadeTo(2000, 500).slideUp(500, function () {
		$("#alert").slideUp(500);
	});
}