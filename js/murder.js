$(document).ready(function () {
    // The amount of players entered (int/long)
    var numPlayers;
    // The roles: it will contain the amount there is of each role. (JSON)
    var roles = {};
    var rolesArr = [];
    var mode = 'default'; // Can be default or oneSpec
    var currentRole = 0; // Only for revealing
    var revealed = false; // Check if current role has been revealed
    const POSSIBLE_ROLES = ['Innocent', 'Detective', 'Murderer'];
    var MIN = POSSIBLE_ROLES.length;
    var MAX = POSSIBLE_ROLES.length*5;

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
        console.log(numPlayers);
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
        } else {
            return true;
        }
    }

    /**
     * Takes the input (amount of players) and randomly inserts the amount of roles in the roles arr
     * @param {object} _callback - Callback function
     */
    function processData(_callback) {
        // Calculate amount of players for each role
        for (const role in roles) {
            if (roles.hasOwnProperty(role)) {
                roles[role] = mode == 'oneSpec' ? 1 : Math.floor(numPlayers / POSSIBLE_ROLES.length);
                // Make sure that innocent has the oveflow
                if (role == 'Innocent') {
                    roles[role] = mode == 'oneSpec' ?
                        numPlayers - (POSSIBLE_ROLES.length - 1) :
                        roles[role] + (numPlayers % POSSIBLE_ROLES.length);
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
        $(".reveal").attr('hidden', false);
    }

    // "Process" form data
    $('.enter-num-players').on('submit', function (e) {
        e.preventDefault();
        numPlayers = Number($("#players").val()); // Update numPlayers
        if (!validateForm()) { // Check input
            return false;
        }
        $(".enter-num-players").hide(); // Hide form
        processData(revealRoles); // Update roles and rolesArr
    });

    $(".mode a").on('click', function (e) {
        e.preventDefault(); // Just in case
        mode = $(this).attr("name"); // Get mode
    });

    $("#reveal-btn").on('click', function () {
        if (currentRole < numPlayers) {
            if (!revealed) {
                $(".reveal-msg").remove();
                $(".reveal").prepend("<p class='reveal-msg'>Your role is <span id='role' class='" +
                    rolesArr[currentRole].toLowerCase() + "'>" + rolesArr[currentRole] + "</span>!</p>");
                let others = getAllOfRoleExcept(rolesArr[currentRole], currentRole);
                console.log(others);
                let othersMessage = currentRole == 'Innocent' ? "" :
                    others.length < 1 ? "" :
                    others.length == 1 ? "The other " + rolesArr[currentRole] + " is " :
                    "The other " + rolesArr[currentRole] + "s are ";

                if (others.length > 2 && currentRole != 'Innocent') {
                    for (let index = 0; index < others.length - 1; index++) {
                        othersMessage += "Person #" + (others[index] + 1) + ", "
                    }
                    othersMessage += "and ";
                } else if (others.length == 2 && rolesArr[currentRole] != 'Innocent') {
                    othersMessage += "Person #" + (others[0] + 1) + " and ";
                }
                if (others.length >= 1 && rolesArr[currentRole] != 'Innocent') {
                    othersMessage += "Person #" + (others[others.length - 1] + 1);
                }

                console.log(othersMessage)

                $("#reveal-lbl").html("☝<br>click this once you've read and memorized it. (Then, let the next person get their role!)" +
                    "<br>" + othersMessage + ".");
                $(this).text("next");
                revealed = true;
                currentRole++;
            } else {
                $(this).text("reveal");
                revealed = false;
                $(".reveal-msg").html("<br>");
                $("#reveal-lbl").html("☝<br>click this to reveal your role!");
            }
        } else {
            $(".reveal").remove();
            $("#finish").removeClass("hidden")
                .attr("hidden", false);
        }
    });

    $("#finish-btn").on('click', function () {
        $('#finish').remove();
        $("#new-game").removeClass("hidden")
            .attr("hidden", false);
    });

    $("#new-game-btn").on('click', function () {
        location.reload();
    });

    /**
     * Shuffles array in place.
     * @param {Array} a items An array containing the items.
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
});