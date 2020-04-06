$(document).ready(function () {
	// The amount of players entered (int/long)
	// NOTE: MOST VARIABLES COPIED HERE WILL NEED TO BE RESET IN THE RESET FUNCTION
	var numPlayers;
	// The roles: it will contain the amount there is of each role. (JSON)
	var roles = {};
	var rolesArr = [];
	var mode = 'default'; // Can be default or oneSpec
	var currentRole = 0; // Only for revealing
	var revealed = false; // Check if current role has been revealed
	const POSSIBLE_ROLES = ['Innocent', 'Sheriff', 'Murderer']; // Persistent after reset
	const MIN = POSSIBLE_ROLES.length; // Persistent after reset
	const MAX = POSSIBLE_ROLES.length * 5; // Persistent after reset
	var names = {} // Persistent after reset

	// Initialize roles
	for (let i = 0; i < POSSIBLE_ROLES.length; i++) {
		const role = POSSIBLE_ROLES[i];
		roles[role] = 0;
	}

	// Set min and max of form
	$("#players").attr("min", MIN);
	$("#players").attr("max", MAX);
	$("#players").attr("placeholder", MIN + "-" + MAX);

	/**
	 * Make sure the value entered was valid
	 */
	function validateForm() {
		if (numPlayers < MIN) { // Make sure it isn't too small
			message("Danger", "Oops!", "Please enter a # of players bigger than (or equal to) " +
				MIN + ". 🤓");
			return false;
		} else if (numPlayers > MAX) { // Make sure it isn't too big
			message("Danger", "Oops!", "Please enter a # of players less than " + MAX +
				". 😊");
			return false;
		} else if (!numPlayers || !POSSIBLE_ROLES) { // Make sure nothing went crazy
			message("Warning", "Woah!", "Something went badly wrong! 🐷 ^\_(ツ)_/^");
			return false;
		} else { // Great!
			return true;
		}
	}

	/**
	 * Takes the input (amount of players) and randomly inserts the amount of roles in the roles arr
	 * @param {Function} _callback - Callback function
	 */
	function processData(_callback) {
		// Calculate amount of players for each role
		for (const role in roles) {
			if (roles.hasOwnProperty(role)) {
				roles[role] = mode == 'oneSpec' ? 1 : Math.floor(numPlayers / POSSIBLE_ROLES.length);
				// Make sure that innocent has the oveflow
				if (role == 'Innocent') {
					roles[role] = mode == 'oneSpec' ? // If the mode is one special:
						numPlayers - (POSSIBLE_ROLES.length - 1) : // Then the the amount of this role will be the amount of players minus itself
						roles[role] + (numPlayers % POSSIBLE_ROLES.length); // Else, this is the default mode
				}
			}
		}

		// Populate rolesArr[]
		for (const role in roles) {
			if (roles.hasOwnProperty(role)) {
				// Example: {role: 'Innocent', amount: '2'}
				const amount = roles[role];
				for (let i = 0; i < amount; i++) {
					rolesArr.push(role);
				}
			}
		}
		shuffle(rolesArr);
		_callback();
	}

	function revealRoles() {
		updateGreeting(0);
		$(".reveal").show();
	}

	// Enter player names dropdown (make sure that the length of array is right)
	$(".enter-player-names").on('show.bs.dropdown', function () {
		// NOTE: $names is the div holding the names inputs. 
		// 		 Use $names.children() to access the children
		console.log("adding names")
		let $names = $("#names");
		let $players = $("#players");
		if ($names.children().length < $players.val()) {
			while ($names.children().length < $players.val()) {
				$names.append(`<input type='text' class='dropdown-item border name' ` + 
					`placeholder='Player #${$names.children().length+1}'>`);
			}
		} else if ($names.children().length > $players.val()) {
			console.log("removing names");
			while ($names.children().length > $players.val()) {
				$names.children().last().remove();
				console.log("removing name")
			}
		} else {
			console.log("we good");
		}
	});

	// "Process" form data
	$('.enter-num-players').on('submit', function (e) {
		e.preventDefault();
		numPlayers = Number($("#players").val()); // Update numPlayers
		if (!validateForm()) { // Check input
			return false;
		}
		$(".enter-num-players").hide(); // Hide form
		updateNames(); // Update the names Map with the values entered
		processData(revealRoles); // Update roles and rolesArr
	});

	$(".mode a").on('click', function (e) {
		e.preventDefault(); // Just in case
		mode = $(this).attr("id").replace("mode-", ''); // Get mode
		$(".mode a").removeClass("active");
		$(this).addClass("active");
	});

	$("#reveal-btn").on('click', function () {
		if (currentRole < numPlayers) { // If we aren't done yet
			if (!revealed) { // If we haven't revealed it yet
				$(".reveal-msg").empty(); // Get rid of the old reveal message

				// Add a reveal message
				$(".reveal-msg").html("Your role is <span class='role' id='" +
					rolesArr[currentRole].toLowerCase() + "'>" + rolesArr[currentRole] + "</span>!");

				// Get others that have the same role
				let others = getAllOfRoleExcept(rolesArr[currentRole], currentRole);

				// Generate the others message
				let othersMessage = genOthersMessage(rolesArr[currentRole], others)

				// Show the others message along with the 'click this' message, unless they're innocent
				$("#reveal-lbl").html("☝<br>click this once you've read and memorized it. (Then, let the next person get their role!)" +
					"<br>" + (rolesArr[currentRole] == 'Innocent' ? "" : othersMessage));

				// Update button text
				$(this).text("next");
				// Update revealed
				revealed = true;
				// Make sure we move on to the next person
				currentRole++;
			} else { // We've already revealed
				// Update text
				$(this).text("reveal");
				// Update revealed
				revealed = false;
				// Add a placeholder to the blank reveal message
				$(".reveal-msg").html("<br>");
				// Update the reveal label
				$("#reveal-lbl").html("☝<br>click this to reveal your role!");
				// Update the greeting
				updateGreeting(currentRole);
			}
		} else {
			// We're done
			$(".reveal").hide();
			$("#finish").show();
		}
	});

	$("#finish-btn").on('click', function () {
		// Move on to the new-game scene
		$('#finish').hide();
		$("#new-game").show();
	});

	$("#new-game-btn").on('click', function () {
		reset();
	});

	/**
	 * Shuffles array in place.
	 * @param {Array} a - An array containing the items.
	 */
	function shuffle(a) {
		var j, x, i;
		for (i = a.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = a[i];
			a[i] = a[j];
			a[j] = x;
		}
		return a;
	}


	/**
	 * @param  {string} role - The role we're looking for
	 * @param  {number} except - The index of the role not wanted
	 * @returns {Array} - the indexes for all of the roles in rolesArr matching param 'role' except (if specified) the index except
	 */
	function getAllOfRoleExcept(role, except) {
		var found = [];
		for (let i = 0; i < rolesArr.length; i++) {
			const r = rolesArr[i];
			if (r == role && i != except) {
				found.push(i);
			}
		}
		return found;
	}

	/**
	 * Generates an 'others' message. eg - "Person #2, Person #5, and Person #9"
	 */
	function genOthersMessage(role, others) {
		let othersMessage = "";
		if (others.length > 2) {
			for (let index = 0; index < others.length - 1; index++) {
				const currentPerson = others[index]
				// if there is a name for the current person
				othersMessage +=
					(!names[currentPerson] ? `Person #${currentPerson + 1}` :
						names[currentPerson]) +
					", ";
			}
			othersMessage += "and ";
		} else if (others.length == 2) {
			othersMessage +=
				(!names[others[0]] ? "Person #" + (others[0] + 1) :
					names[others[0]]) +
				" and ";
		}
		if (others.length >= 1) {
			othersMessage = (role == 'Innocent' ? "" :
					others.length < 1 ? "" :
					others.length == 1 ? "The other " + role + " is " :
					"The other " + role + "s are ") +
				"<span class='role' id='" + role.toLowerCase() + "'>" + othersMessage;
			othersMessage +=
				(!names[others[others.length - 1]] ? "Person #" + (others[others.length - 1] + 1) :
					names[others[others.length - 1]]) +
				"</span>.";
		}
		return othersMessage;
	}

	/**
	 * Update the names map with values entered
	 */
	function updateNames() {
		$(".name").each(function (index) {
			if ($(this).val().trim()) {
				names[index] = $(this).val();
			}
		});
		console.log(names);
	}
	/**
	 * Update the greeting message
	 */
	function updateGreeting(user) {
		let $greeting = $(".greeting");
		if (names[user]) {
			$greeting.text(`Hi, ${names[user]}!`);
		} else {
			$greeting.text('Hello!')
		}
	}

	/**
	 * Reset the page to the original view
	 */
	function reset() {
		// Reset all the variables
		numPlayers = null;
		roles = {};
		rolesArr = [];
		mode = 'default';
		currentRole = 0;

		for (let i = 0; i < POSSIBLE_ROLES.length; i++) {
			const role = POSSIBLE_ROLES[i];
			roles[role] = 0;
		}

		// Set min and max of form
		$("#players").attr("min", MIN);
		$("#players").attr("max", MAX);
		$("#players").attr("placeholder", MIN + "-" + MAX);

		// Reset the page view
		$("#new-game").hide();
		$(".enter-num-players").show();

		// Reset the reveal div 
		$("#reveal").text("reveal");
		// Update revealed
		revealed = false;
		// Add a placeholder to the blank reveal message
		$(".reveal-msg").html("<br>");
		// Update the reveal label
		$("#reveal-lbl").html("☝<br>click this to reveal your role!");
	}
	
	window.onerror = function() {
		message("danger", "That's not good!", "An error happened!")
	}
});