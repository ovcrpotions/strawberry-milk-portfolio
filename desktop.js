/* =========================================================
   STRAWBERRY MILK OS
   Desktop controls
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");
    const startMenu = document.getElementById("start-menu");
    const clocks = document.querySelectorAll("#clock, .clock");


    /* =====================================================
       CLOCK
       ===================================================== */

    function updateClock() {
        const now = new Date();

        let hours = now.getHours();
        const minutes = now.getMinutes();

        const period = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;

        if (hours === 0) {
            hours = 12;
        }

        const formattedMinutes = String(minutes).padStart(2, "0");

        const time = `${hours}:${formattedMinutes} ${period}`;

        clocks.forEach((clock) => {
            clock.textContent = time;
        });
    }

    updateClock();

    setInterval(updateClock, 1000);


    /* =====================================================
       START MENU
       ===================================================== */

    if (startButton && startMenu) {

        startButton.addEventListener("click", (event) => {
            event.stopPropagation();

            const isOpen = startMenu.classList.contains("is-open");

            startMenu.classList.toggle("is-open", !isOpen);
        });


        /* Don't close the menu when clicking inside it */

        startMenu.addEventListener("click", (event) => {
            event.stopPropagation();
        });


        /* Close when clicking elsewhere */

        document.addEventListener("click", () => {
            startMenu.classList.remove("is-open");
        });


        /* Close with Escape */

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                startMenu.classList.remove("is-open");
            }
        });
    }
});