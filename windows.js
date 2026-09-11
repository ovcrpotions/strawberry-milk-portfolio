/* =========================================================
   STRAWBERRY MILK OS
   Window manager
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const windows = Array.from(
        document.querySelectorAll(".window")
    );

    const taskbarApps = Array.from(
        document.querySelectorAll(".taskbar-app")
    );

    let highestZIndex = 20;


    /* =====================================================
       WINDOW SETUP
       ===================================================== */

    windows.forEach((windowElement, index) => {

        windowElement.dataset.windowId =
            `window-${index + 1}`;

        windowElement.style.zIndex =
            highestZIndex + index;

        setupWindow(windowElement);
    });


    /* =====================================================
       SET UP INDIVIDUAL WINDOW
       ===================================================== */

    function setupWindow(windowElement) {

        const titlebar =
            windowElement.querySelector(".window-titlebar");

        const minimizeButton =
            windowElement.querySelector(".minimize");

        const maximizeButton =
            windowElement.querySelector(".maximize");

        const closeButton =
            windowElement.querySelector(".close");


        /* Initial active state */

        activateWindow(windowElement);


        /* =================================================
           CLICK WINDOW TO FOCUS
           ================================================= */

        windowElement.addEventListener("pointerdown", () => {
            activateWindow(windowElement);
        });


        /* =================================================
           MINIMIZE
           ================================================= */

        if (minimizeButton) {

            minimizeButton.addEventListener("click", (event) => {

                event.stopPropagation();

                minimizeWindow(windowElement);
            });
        }


        /* =================================================
           MAXIMIZE
           ================================================= */

        if (maximizeButton) {

            maximizeButton.addEventListener("click", (event) => {

                event.stopPropagation();

                toggleMaximize(windowElement);
            });
        }


        /* =================================================
           CLOSE
           ================================================= */

        if (closeButton) {

            closeButton.addEventListener("click", (event) => {

                event.stopPropagation();

                closeWindow(windowElement);
            });
        }


        /* =================================================
           DRAGGING
           ================================================= */

        if (titlebar) {
            setupDragging(windowElement, titlebar);
        }
    }


    /* =====================================================
       ACTIVATE WINDOW
       ===================================================== */

    function activateWindow(windowElement) {

        highestZIndex += 1;

        windowElement.style.zIndex = highestZIndex;

        windows.forEach((otherWindow) => {

            if (otherWindow === windowElement) {
                otherWindow.classList.add("is-active");
                otherWindow.classList.remove("is-inactive");
            } else {
                otherWindow.classList.remove("is-active");
                otherWindow.classList.add("is-inactive");
            }
        });
    }


    /* =====================================================
       MINIMIZE WINDOW
       ===================================================== */

    function minimizeWindow(windowElement) {

        windowElement.classList.add("is-minimized");
        windowElement.classList.remove("is-active");

        updateTaskbarState(windowElement);
    }


    /* =====================================================
       RESTORE WINDOW
       ===================================================== */

    function restoreWindow(windowElement) {

        windowElement.classList.remove("is-minimized");

        activateWindow(windowElement);

        updateTaskbarState(windowElement);
    }


    /* =====================================================
       MAXIMIZE WINDOW
       ===================================================== */

    function toggleMaximize(windowElement) {

        const isMaximized =
            windowElement.classList.contains("is-maximized");


        if (isMaximized) {

            restoreWindowSize(windowElement);

        } else {

            maximizeWindow(windowElement);
        }

        activateWindow(windowElement);
    }


    function maximizeWindow(windowElement) {

        /*
         * Store the current position and size so that
         * we can restore it later.
         */

        const rect =
            windowElement.getBoundingClientRect();

        windowElement.dataset.previousLeft =
            `${rect.left}px`;

        windowElement.dataset.previousTop =
            `${rect.top}px`;

        windowElement.dataset.previousWidth =
            `${rect.width}px`;

        windowElement.dataset.previousHeight =
            `${rect.height}px`;


        /*
         * Remove transform because maximized windows
         * use their own positioning.
         */

        windowElement.style.transform = "none";

        windowElement.classList.add("is-maximized");

        updateMaximizeButton(windowElement, true);
    }


    /* =====================================================
       RESTORE WINDOW SIZE
       ===================================================== */

    function restoreWindowSize(windowElement) {

        windowElement.classList.remove("is-maximized");

        const previousLeft =
            windowElement.dataset.previousLeft;

        const previousTop =
            windowElement.dataset.previousTop;

        const previousWidth =
            windowElement.dataset.previousWidth;

        const previousHeight =
            windowElement.dataset.previousHeight;


        if (
            previousLeft &&
            previousTop &&
            previousWidth &&
            previousHeight
        ) {

            windowElement.style.left =
                previousLeft;

            windowElement.style.top =
                previousTop;

            windowElement.style.width =
                previousWidth;

            windowElement.style.height =
                previousHeight;

            windowElement.style.transform =
                "none";
        }


        updateMaximizeButton(windowElement, false);
    }


    /* =====================================================
       MAXIMIZE BUTTON ICON
       ===================================================== */

    function updateMaximizeButton(
        windowElement,
        isMaximized
    ) {

        const button =
            windowElement.querySelector(".maximize");

        if (!button) return;

        button.textContent =
            isMaximized ? "❐" : "□";
    }


    /* =====================================================
       CLOSE WINDOW
       ===================================================== */

    function closeWindow(windowElement) {

        windowElement.classList.add("is-minimized");

        windowElement.classList.remove("is-active");

        updateTaskbarState(windowElement);
    }


    /* =====================================================
       TASKBAR
       ===================================================== */

    function updateTaskbarState(windowElement) {

        const windowTitle =
            windowElement
                .querySelector(".window-title span:last-child")
                ?.textContent
                .trim()
                .toLowerCase();


        taskbarApps.forEach((app) => {

            const appText =
                app.textContent
                    .trim()
                    .toLowerCase();


            if (
                windowTitle &&
                appText.includes(windowTitle)
            ) {

                app.classList.toggle(
                    "active",
                    !windowElement.classList.contains(
                        "is-minimized"
                    )
                );
            }
        });
    }


    /* =====================================================
       TASKBAR CLICK BEHAVIOR
       ===================================================== */

    taskbarApps.forEach((app) => {

        app.addEventListener("click", (event) => {

            /*
             * Normal navigation is preserved for links
             * that point to another page.
             */

            const target =
                app.getAttribute("href");

            if (!target || target === "#") {
                event.preventDefault();
            }
        });
    });


    /* =====================================================
       DRAGGING
       ===================================================== */

    function setupDragging(
        windowElement,
        titlebar
    ) {

        let isDragging = false;

        let offsetX = 0;
        let offsetY = 0;


        titlebar.addEventListener(
            "pointerdown",
            startDragging
        );


        function startDragging(event) {

            /*
             * Don't start dragging if the user clicked
             * a window control.
             */

            if (
                event.target.closest(
                    ".window-control"
                )
            ) {
                return;
            }


            /*
             * Don't drag maximized windows.
             */

            if (
                windowElement.classList.contains(
                    "is-maximized"
                )
            ) {
                return;
            }


            isDragging = true;

            activateWindow(windowElement);

            windowElement.classList.add(
                "is-dragging"
            );

            titlebar.setPointerCapture(
                event.pointerId
            );


            const rect =
                windowElement.getBoundingClientRect();


            offsetX =
                event.clientX - rect.left;

            offsetY =
                event.clientY - rect.top;
        }


        titlebar.addEventListener(
            "pointermove",
            drag
        );


        function drag(event) {

            if (!isDragging) return;


            const desktop =
                document.querySelector(".desktop");

            const desktopRect =
                desktop.getBoundingClientRect();


            let newLeft =
                event.clientX -
                desktopRect.left -
                offsetX;

            let newTop =
                event.clientY -
                desktopRect.top -
                offsetY;


            /*
             * Keep the window inside the desktop.
             */

            const windowRect =
                windowElement.getBoundingClientRect();


            const maxLeft =
                desktopRect.width -
                windowRect.width -
                5;

            const maxTop =
                desktopRect.height -
                windowRect.height -
                60;


            newLeft =
                Math.max(
                    5,
                    Math.min(
                        newLeft,
                        maxLeft
                    )
                );

            newTop =
                Math.max(
                    5,
                    Math.min(
                        newTop,
                        maxTop
                    )
                );


            windowElement.style.left =
                `${newLeft}px`;

            windowElement.style.top =
                `${newTop}px`;

            windowElement.style.transform =
                "none";
        }


        titlebar.addEventListener(
            "pointerup",
            stopDragging
        );

        titlebar.addEventListener(
            "pointercancel",
            stopDragging
        );


        function stopDragging(event) {

            if (!isDragging) return;

            isDragging = false;

            windowElement.classList.remove(
                "is-dragging"
            );

            try {
                titlebar.releasePointerCapture(
                    event.pointerId
                );
            } catch {
                /* Pointer capture may already be released. */
            }
        }
    }


    /* =====================================================
       KEYBOARD SHORTCUTS
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            /*
             * Escape closes the currently active window.
             */

            if (event.key !== "Escape") {
                return;
            }

            const activeWindow =
                windows.find((windowElement) =>
                    windowElement.classList.contains(
                        "is-active"
                    )
                );


            if (activeWindow) {
                closeWindow(activeWindow);
            }
        }
    );


    /* =====================================================
       INITIAL WINDOW
       ===================================================== */

    if (windows.length > 0) {
        activateWindow(windows[0]);
    }

});