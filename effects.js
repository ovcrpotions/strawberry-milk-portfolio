/* =========================================================
   STRAWBERRY MILK OS
   Small visual interactions
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       BUTTON PRESS FEEDBACK
       ===================================================== */

    const buttons =
        document.querySelectorAll(
            ".button, .start-button, .taskbar-app"
        );


    buttons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                button.classList.add(
                    "is-clicked"
                );


                setTimeout(() => {

                    button.classList.remove(
                        "is-clicked"
                    );

                }, 180);
            }
        );
    });


    /* =====================================================
       DESKTOP ICON DOUBLE-CLICK FEEL
       ===================================================== */

    const desktopIcons =
        document.querySelectorAll(
            ".desktop-icon"
        );


    desktopIcons.forEach((icon) => {

        icon.addEventListener(
            "dblclick",
            () => {

                icon.animate(
                    [
                        {
                            transform:
                                "scale(1)"
                        },

                        {
                            transform:
                                "scale(0.92)"
                        },

                        {
                            transform:
                                "scale(1)"
                        }
                    ],
                    {
                        duration: 180,
                        easing: "ease-out"
                    }
                );
            }
        );
    });


    /* =====================================================
       STRAWBERRY HOVER WIGGLE
       ===================================================== */

    const strawberries =
        document.querySelectorAll(
            ".welcome-strawberry, .desktop-icon .icon"
        );


    strawberries.forEach((strawberry) => {

        strawberry.addEventListener(
            "mouseenter",
            () => {

                if (
                    window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches
                ) {
                    return;
                }


                strawberry.animate(
                    [
                        {
                            transform:
                                "rotate(0deg)"
                        },

                        {
                            transform:
                                "rotate(-5deg)"
                        },

                        {
                            transform:
                                "rotate(5deg)"
                        },

                        {
                            transform:
                                "rotate(0deg)"
                        }
                    ],
                    {
                        duration: 300,
                        easing: "ease-in-out"
                    }
                );
            }
        );
    });


    /* =====================================================
       RANDOM LITTLE STRAWBERRY DECORATIONS
       ===================================================== */

    createDesktopDecorations();


    function createDesktopDecorations() {

        const desktop =
            document.querySelector(".desktop");


        if (!desktop) {
            return;
        }


        const reducedMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;


        /*
         * Keep decorations subtle.
         */

        const decorations = [
            "♡",
            "✦",
            "·",
            "🍓"
        ];


        for (let i = 0; i < 8; i++) {

            const decoration =
                document.createElement("span");

            decoration.className =
                "floating-decoration";

            decoration.textContent =
                decorations[
                    Math.floor(
                        Math.random() *
                        decorations.length
                    )
                ];


            decoration.style.left =
                `${10 + Math.random() * 80}%`;

            decoration.style.top =
                `${10 + Math.random() * 70}%`;

            decoration.style.opacity =
                `${0.12 + Math.random() * 0.15}`;


            decoration.style.pointerEvents =
                "none";

            decoration.style.position =
                "absolute";

            decoration.style.zIndex =
                "1";

            decoration.style.fontSize =
                `${10 + Math.random() * 10}px`;


            desktop.appendChild(
                decoration
            );


            /*
             * Only animate if the user hasn't
             * requested reduced motion.
             */

            if (!reducedMotion) {

                decoration.animate(
                    [
                        {
                            transform:
                                "translateY(0)"
                        },

                        {
                            transform:
                                "translateY(-8px)"
                        },

                        {
                            transform:
                                "translateY(0)"
                        }
                    ],
                    {
                        duration:
                            2500 +
                            Math.random() * 1500,

                        iterations:
                            Infinity,

                        easing:
                            "ease-in-out"
                    }
                );
            }
        }
    }


    /* =====================================================
       CONSOLE-FRIENDLY WELCOME
       ===================================================== */

    console.log(
        "%c🍓 Welcome to JadeOS! 🥛",
        "font-size: 18px; font-weight: bold;"
    );

    console.log(
        "Strawberry Milk Edition — made with HTML, CSS & JS ♡"
    );

});