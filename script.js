// ========================================
// HEALTHDESK
// MAIN JAVASCRIPT
// ========================================


// ========================================
// HELPER FUNCTIONS
// ========================================

function getUsers() {

    return JSON.parse(
        localStorage.getItem("healthdeskUsers") || "[]"
    );

}


function saveUsers(users) {

    localStorage.setItem(
        "healthdeskUsers",
        JSON.stringify(users)
    );

}


function getAppointments() {

    return JSON.parse(
        localStorage.getItem("healthdeskAppointments") || "[]"
    );

}


function saveAppointments(appointments) {

    localStorage.setItem(
        "healthdeskAppointments",
        JSON.stringify(appointments)
    );

}


function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem("healthdeskCurrentUser") || "null"
    );

}


function showMessage(element, message, type = "error") {

    if (!element) return;

    element.textContent = message;

    element.style.display = "block";

    if (type === "success") {

        element.style.color = "#16a34a";

    } else {

        element.style.color = "#dc2626";

    }

}


// ========================================
// LOGIN / SIGN UP
// ========================================

const loginForm =
    document.getElementById("loginForm");

const signupForm =
    document.getElementById("signupForm");

const loginSection =
    document.getElementById("loginSection");

const signupSection =
    document.getElementById("signupSection");

const showSignup =
    document.getElementById("showSignup");

const showLogin =
    document.getElementById("showLogin");


// SHOW SIGN UP

if (showSignup) {

    showSignup.addEventListener(
        "click",
        function() {

            if (loginSection) {
                loginSection.classList.add("hidden");
            }

            if (signupSection) {
                signupSection.classList.remove("hidden");
            }

        }
    );

}


// SHOW LOGIN

if (showLogin) {

    showLogin.addEventListener(
        "click",
        function() {

            if (signupSection) {
                signupSection.classList.add("hidden");
            }

            if (loginSection) {
                loginSection.classList.remove("hidden");
            }

        }
    );

}


// ========================================
// SIGN UP
// ========================================

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const name =
                document.getElementById("signupName").value.trim();

            const studentId =
                document.getElementById("signupStudentId").value.trim();

            const email =
                document.getElementById("signupEmail").value.trim();

            const password =
                document.getElementById("signupPassword").value;


            if (!name) {

                alert("Please enter your full name.");

                return;

            }


            if (!studentId) {

                alert("Please enter your student ID.");

                return;

            }


            if (!email.includes("@")) {

                alert("Please enter a valid email.");

                return;

            }


            if (password.length < 6) {

                alert(
                    "Password must be at least 6 characters."
                );

                return;

            }


            const users = getUsers();


            const existingUser =
                users.find(
                    user =>
                        user.email.toLowerCase() ===
                        email.toLowerCase()
                );


            if (existingUser) {

                alert(
                    "An account with this email already exists."
                );

                return;

            }


            const newUser = {

                id: Date.now(),

                name: name,

                studentId: studentId,

                email: email,

                password: password

            };


            users.push(newUser);

            saveUsers(users);


            alert(
                "Account created successfully! You can now log in."
            );


            signupForm.reset();


            if (signupSection) {
                signupSection.classList.add("hidden");
            }

            if (loginSection) {
                loginSection.classList.remove("hidden");
            }

        }
    );

}


// ========================================
// LOGIN
// ========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const email =
                document.getElementById("loginEmail").value.trim();

            const password =
                document.getElementById("loginPassword").value;


            const users = getUsers();


            const user =
                users.find(
                    currentUser =>
                        currentUser.email.toLowerCase() ===
                        email.toLowerCase() &&
                        currentUser.password === password
                );


            if (!user) {

                alert(
                    "Incorrect email or password."
                );

                return;

            }


            localStorage.setItem(
                "healthdeskCurrentUser",
                JSON.stringify(user)
            );


            window.location.href =
                "dashboard.html";

        }
    );

}


// ========================================
// PROTECT USER PAGES
// ========================================

const protectedPages = [

    "dashboard.html",

    "appointment.html",

    "appointments.html"

];


const currentPage =
    window.location.pathname
        .split("/")
        .pop();


if (
    protectedPages.includes(currentPage) &&
    !getCurrentUser()
) {

    window.location.href =
        "index.html";

}


// ========================================
// LOG OUT
// ========================================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function() {

            localStorage.removeItem(
                "healthdeskCurrentUser"
            );

            window.location.href =
                "index.html";

        }
    );

}


// ========================================
// DASHBOARD
// ========================================

const welcomeMessage =
    document.getElementById("welcomeMessage");

const studentNameDisplay =
    document.getElementById("studentNameDisplay");

const totalAppointments =
    document.getElementById("totalAppointments");

const pendingAppointments =
    document.getElementById("pendingAppointments");

const nextAppointment =
    document.getElementById("nextAppointment");


function loadDashboard() {

    const user =
        getCurrentUser();

    if (!user) return;


    if (welcomeMessage) {

        welcomeMessage.textContent =
            "Welcome, " + user.name + " 👋";

    }


    if (studentNameDisplay) {

        studentNameDisplay.textContent =
            user.name;

    }


    const appointments =
        getAppointments().filter(
            appointment =>
                appointment.userEmail === user.email
        );


    if (totalAppointments) {

        totalAppointments.textContent =
            appointments.length;

    }


    if (pendingAppointments) {

        pendingAppointments.textContent =
            appointments.filter(
                appointment =>
                    appointment.status === "Pending"
            ).length;

    }


    if (nextAppointment) {

        if (appointments.length === 0) {

            nextAppointment.innerHTML = `
                <div class="empty-dashboard">
                    <span>📅</span>
                    <p>You don't have any appointments yet.</p>
                    <a href="appointment.html"
                       class="btn primary-btn">
                        Book Appointment
                    </a>
                </div>
            `;

            return;

        }


        const upcoming =
            appointments
                .filter(
                    appointment =>
                        appointment.status !== "Rejected" &&
                        appointment.status !== "Completed"
                )
                .sort(
                    (a, b) =>
                        new Date(
                            a.date + "T" + a.time
                        ) -
                        new Date(
                            b.date + "T" + b.time
                        )
                )[0];


        if (!upcoming) {

            nextAppointment.innerHTML = `
                <div class="empty-dashboard">
                    <span>✅</span>
                    <p>No upcoming appointments.</p>
                </div>
            `;

            return;

        }


        nextAppointment.innerHTML = `

            <div class="next-card">

                <div class="next-card-header">

                    <h3>
                        Clinic Appointment
                    </h3>

                    <span class="next-status">
                        ${upcoming.status}
                    </span>

                </div>


                <div class="next-details">

                    <p>
                        Date
                        <strong>
                            ${upcoming.date}
                        </strong>
                    </p>

                    <p>
                        Time
                        <strong>
                            ${upcoming.time}
                        </strong>
                    </p>

                    <p>
                        Reason
                        <strong>
                            ${upcoming.reason}
                        </strong>
                    </p>

                </div>

            </div>

        `;

    }

}


if (
    currentPage === "dashboard.html"
) {

    loadDashboard();

}


// ========================================
// APPOINTMENT FORM
// ========================================

const appointmentForm =
    document.getElementById(
        "appointmentForm"
    );


if (appointmentForm) {

    appointmentForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const user =
                getCurrentUser();


            if (!user) {

                window.location.href =
                    "index.html";

                return;

            }


            const appointmentType =
                document.getElementById(
                    "appointmentType"
                )?.value || "Public";


            const date =
                document.getElementById(
                    "appointmentDate"
                )?.value;


            const time =
                document.getElementById(
                    "appointmentTime"
                )?.value;


            const reason =
                document.getElementById(
                    "appointmentReason"
                )?.value.trim();


            const notes =
                document.getElementById(
                    "appointmentNotes"
                )?.value.trim() || "";


            if (!date || !time || !reason) {

                alert(
                    "Please complete all required fields."
                );

                return;

            }


            const appointment = {

                id: Date.now(),

                userEmail:
                    user.email,

                studentName:
                    user.name,

                studentId:
                    user.studentId,

                type:
                    appointmentType,

                date:
                    date,

                time:
                    time,

                reason:
                    reason,

                notes:
                    notes,

                status:
                    "Pending",

                createdAt:
                    new Date().toISOString()

            };


            const appointments =
                getAppointments();


            appointments.push(
                appointment
            );


            saveAppointments(
                appointments
            );


            alert(
                "Appointment submitted successfully!"
            );


            window.location.href =
                "appointments.html";

        }
    );

}


// ========================================
// MY APPOINTMENTS
// ========================================

const appointmentsList =
    document.getElementById(
        "appointmentsList"
    );


function loadAppointments() {

    if (!appointmentsList) return;


    const user =
        getCurrentUser();


    if (!user) return;


    const appointments =
        getAppointments().filter(
            appointment =>
                appointment.userEmail ===
                user.email
        );


    if (appointments.length === 0) {

        appointmentsList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📅
                </div>

                <h2>
                    No Appointments
                </h2>

                <p>
                    You don't have any clinic appointments yet.
                </p>

                <a
                    href="appointment.html"
                    class="btn primary-btn"
                >
                    Book Appointment
                </a>

            </div>

        `;

        return;

    }


    appointmentsList.innerHTML = "";


    appointments
        .sort(
            (a, b) =>
                new Date(
                    b.createdAt
                ) -
                new Date(
                    a.createdAt
                )
        )
        .forEach(
            appointment => {

                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "appointment-card";


                card.innerHTML = `

                    <div class="appointment-header">

                        <h2>
                            Clinic Appointment
                        </h2>

                        <span
                            class="appointment-status status-${appointment.status.toLowerCase()}"
                        >
                            ${appointment.status}
                        </span>

                    </div>


                    <div class="appointment-details">

                        <p>
                            <strong>
                                Type:
                            </strong>
                            ${appointment.type}
                        </p>

                        <p>
                            <strong>
                                Date:
                            </strong>
                            ${appointment.date}
                        </p>

                        <p>
                            <strong>
                                Time:
                            </strong>
                            ${appointment.time}
                        </p>

                        <p>
                            <strong>
                                Reason:
                            </strong>
                            ${appointment.reason}
                        </p>

                        ${
                            appointment.notes
                                ? `
                                    <p>
                                        <strong>
                                            Notes:
                                        </strong>
                                        ${appointment.notes}
                                    </p>
                                  `
                                : ""
                        }

                    </div>


                    ${
                        appointment.status === "Pending"
                            ? `
                                <button
                                    class="cancel-btn"
                                    onclick="cancelAppointment(${appointment.id})"
                                >
                                    Cancel Appointment
                                </button>
                              `
                            : ""
                    }

                `;


                appointmentsList.appendChild(
                    card
                );

            }
        );

}


function cancelAppointment(
    appointmentId
) {

    const appointments =
        getAppointments();


    const appointment =
        appointments.find(
            item =>
                item.id === appointmentId
        );


    if (!appointment) return;


    const confirmCancel =
        confirm(
            "Are you sure you want to cancel this appointment?"
        );


    if (!confirmCancel) return;


    appointment.status =
        "Rejected";


    saveAppointments(
        appointments
    );


    loadAppointments();

}


window.cancelAppointment =
    cancelAppointment;


if (
    currentPage === "appointments.html"
) {

    loadAppointments();

}


// ========================================
// ADMIN LOGIN
// ========================================

const adminLoginForm =
    document.getElementById(
        "adminLoginForm"
    );


if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "adminEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "adminPassword"
                ).value;


            if (
                email ===
                    "admin@healthdesk.com" &&
                password ===
                    "admin123"
            ) {

                localStorage.setItem(
                    "healthdeskAdmin",
                    "true"
                );


                window.location.href =
                    "admin.html";

            }

            else {

                alert(
                    "Incorrect admin email or password."
                );

            }

        }
    );

}


// ========================================
// ADMIN PAGE PROTECTION
// ========================================

if (
    currentPage === "admin.html" &&
    localStorage.getItem(
        "healthdeskAdmin"
    ) !== "true"
) {

    window.location.href =
        "admin-login.html";

}


// ========================================
// ADMIN LOGOUT
// ========================================

const adminLogoutBtn =
    document.getElementById(
        "adminLogoutBtn"
    );


if (adminLogoutBtn) {

    adminLogoutBtn.addEventListener(
        "click",
        function() {

            localStorage.removeItem(
                "healthdeskAdmin"
            );


            window.location.href =
                "admin-login.html";

        }
    );

}


// ========================================
// ADMIN DASHBOARD
// ========================================

const adminTotal =
    document.getElementById(
        "adminTotal"
    );

const adminPending =
    document.getElementById(
        "adminPending"
    );

const adminApproved =
    document.getElementById(
        "adminApproved"
    );

const adminAppointments =
    document.getElementById(
        "adminAppointments"
    );


function loadAdminDashboard() {

    if (!adminAppointments) return;


    const appointments =
        getAppointments();


    if (adminTotal) {

        adminTotal.textContent =
            appointments.length;

    }


    if (adminPending) {

        adminPending.textContent =
            appointments.filter(
                appointment =>
                    appointment.status === "Pending"
            ).length;

    }


    if (adminApproved) {

        adminApproved.textContent =
            appointments.filter(
                appointment =>
                    appointment.status === "Approved"
            ).length;

    }


    if (appointments.length === 0) {

        adminAppointments.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📅
                </div>

                <h2>
                    No Appointments
                </h2>

                <p>
                    There are no student appointments yet.
                </p>

            </div>

        `;

        return;

    }


    adminAppointments.innerHTML = "";


    appointments
        .sort(
            (a, b) =>
                new Date(
                    b.createdAt
                ) -
                new Date(
                    a.createdAt
                )
        )
        .forEach(
            appointment => {

                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "admin-appointment";


                card.innerHTML = `

                    <div class="admin-appointment-header">

                        <h3>
                            ${appointment.studentName}
                        </h3>

                        <span
                            class="admin-status status-${appointment.status.toLowerCase()}"
                        >
                            ${appointment.status}
                        </span>

                    </div>


                    <div class="admin-details">

                        <strong>
                            Student ID:
                        </strong>
                        ${appointment.studentId}

                        <br>

                        <strong>
                            Email:
                        </strong>
                        ${appointment.userEmail}

                        <br>

                        <strong>
                            Type:
                        </strong>
                        ${appointment.type}

                        <br>

                        <strong>
                            Date:
                        </strong>
                        ${appointment.date}

                        <br>

                        <strong>
                            Time:
                        </strong>
                        ${appointment.time}

                        <br>

                        <strong>
                            Reason:
                        </strong>
                        ${appointment.reason}

                        ${
                            appointment.notes
                                ? `
                                    <br>
                                    <strong>
                                        Notes:
                                    </strong>
                                    ${appointment.notes}
                                  `
                                : ""
                        }

                    </div>


                    <div class="admin-actions">

                        ${
                            appointment.status === "Pending"
                                ? `
                                    <button
                                        class="approve-btn"
                                        onclick="updateAppointmentStatus(${appointment.id}, 'Approved')"
                                    >
                                        Approve
                                    </button>

                                    <button
                                        class="reject-btn"
                                        onclick="updateAppointmentStatus(${appointment.id}, 'Rejected')"
                                    >
                                        Reject
                                    </button>
                                  `
                                : ""
                        }


                        ${
                            appointment.status === "Approved"
                                ? `
                                    <button
                                        class="complete-btn"
                                        onclick="updateAppointmentStatus(${appointment.id}, 'Completed')"
                                    >
                                        Complete
                                    </button>
                                  `
                                : ""
                        }

                    </div>

                `;


                adminAppointments.appendChild(
                    card
                );

            }
        );

}


function updateAppointmentStatus(
    appointmentId,
    newStatus
) {

    const appointments =
        getAppointments();


    const appointment =
        appointments.find(
            item =>
                item.id === appointmentId
        );


    if (!appointment) return;


    appointment.status =
        newStatus;


    saveAppointments(
        appointments
    );


    loadAdminDashboard();

}


window.updateAppointmentStatus =
    updateAppointmentStatus;


if (
    currentPage === "admin.html"
) {

    loadAdminDashboard();

}


// ========================================
// HEALTHDESK PWA INSTALL
// WEBSITE ONLY
// ========================================

let deferredPrompt = null;

const installBtn =
    document.getElementById("installBtn");

const downloadOverlay =
    document.getElementById("downloadOverlay");

const downloadMessage =
    document.getElementById("downloadMessage");

const downloadCountdown =
    document.getElementById("downloadCountdown");

const downloadProgressBar =
    document.getElementById("downloadProgressBar");

const installNowBtn =
    document.getElementById("installNowBtn");


// ========================================
// CHECK INSTALL MODE
// ========================================

const isStandalone =
    window.matchMedia(
        "(display-mode: standalone)"
    ).matches ||

    window.matchMedia(
        "(display-mode: fullscreen)"
    ).matches ||

    window.navigator.standalone === true;


// ========================================
// ONLY RUN IF BUTTON EXISTS
// ========================================

if (installBtn) {

    if (isStandalone) {

        installBtn.style.display =
            "none";

    }

    else {

        installBtn.style.display =
            "block";


        window.addEventListener(
            "beforeinstallprompt",
            function(event) {

                event.preventDefault();

                deferredPrompt =
                    event;


                installBtn.style.display =
                    "block";


                console.log(
                    "HealthDesk install prompt is ready."
                );

            }
        );


        installBtn.addEventListener(
            "click",
            function() {

                startHealthDeskDownload();

            }
        );

    }

}


// ========================================
// START DOWNLOAD / PREPARATION
// ========================================

function startHealthDeskDownload() {

    if (!downloadOverlay) {
        return;
    }


    downloadOverlay.classList.add(
        "show"
    );


    let secondsLeft = 15;


    if (downloadCountdown) {

        downloadCountdown.textContent =
            "15 seconds";

    }


    if (downloadMessage) {

        downloadMessage.textContent =
            "Preparing HealthDesk for installation...";

    }


    if (downloadProgressBar) {

        downloadProgressBar.style.width =
            "0%";

    }


    if (installNowBtn) {

        installNowBtn.style.display =
            "none";

    }


    const downloadTimer =
        setInterval(
            function() {

                secondsLeft--;


                const progress =
                    ((15 - secondsLeft) / 15) *
                    100;


                if (downloadCountdown) {

                    downloadCountdown.textContent =
                        secondsLeft +
                        (
                            secondsLeft === 1
                                ? " second"
                                : " seconds"
                        );

                }


                if (downloadProgressBar) {

                    downloadProgressBar.style.width =
                        progress + "%";

                }


                if (secondsLeft <= 0) {

                    clearInterval(
                        downloadTimer
                    );


                    if (downloadProgressBar) {

                        downloadProgressBar.style.width =
                            "100%";

                    }


                    if (downloadCountdown) {

                        downloadCountdown.textContent =
                            "Ready!";

                    }


                    if (downloadMessage) {

                        downloadMessage.textContent =
                            "HealthDesk is ready to be installed.";

                    }


                    if (installNowBtn) {

                        installNowBtn.style.display =
                            "inline-block";

                    }

                }

            },
            1000
        );

}


// ========================================
// INSTALL HEALTHDESK
// ========================================

if (installNowBtn) {

    installNowBtn.addEventListener(
        "click",
        async function() {


            // ==================================
            // ANDROID / CHROME / EDGE
            // ==================================

            if (deferredPrompt) {

                try {

                    await deferredPrompt.prompt();


                    const result =
                        await deferredPrompt.userChoice;


                    console.log(
                        "HealthDesk install result:",
                        result.outcome
                    );


                    deferredPrompt =
                        null;


                    hideDownloadOverlay();


                    if (
                        installBtn &&
                        !isStandalone
                    ) {

                        installBtn.style.display =
                            "block";

                    }


                    return;

                }

                catch (error) {

                    console.error(
                        "HealthDesk installation error:",
                        error
                    );

                }

            }


            // ==================================
            // iPHONE / iPAD
            // ==================================

            const isIOS =
                /iphone|ipad|ipod/i.test(
                    navigator.userAgent
                );


            if (isIOS) {

                hideDownloadOverlay();


                alert(
                    "To install HealthDesk on your iPhone or iPad:\n\n" +
                    "1. Tap the Share button in Safari.\n" +
                    "2. Select 'Add to Home Screen'.\n" +
                    "3. Tap 'Add'.\n\n" +
                    "HealthDesk will then appear on your Home Screen."
                );


                return;

            }


            // ==================================
            // OTHER BROWSERS
            // ==================================

            hideDownloadOverlay();


            alert(
                "Your browser does not provide the automatic installation prompt.\n\n" +
                "Open your browser menu and select " +
                "'Install App' or 'Add to Home Screen'."
            );

        }
    );

}


// ========================================
// HIDE LOADING SCREEN
// ========================================

function hideDownloadOverlay() {

    if (downloadOverlay) {

        downloadOverlay.classList.remove(
            "show"
        );

    }

}


// ========================================
// APP INSTALLED EVENT
// ========================================

window.addEventListener(
    "appinstalled",
    function() {

        console.log(
            "HealthDesk has been installed!"
        );


        hideDownloadOverlay();


        if (
            installBtn &&
            !isStandalone
        ) {

            installBtn.style.display =
                "block";

        }

    }
);