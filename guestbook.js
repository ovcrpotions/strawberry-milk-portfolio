/* =========================================================
   STRAWBERRY MILK OS
   Guestbook
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("guestbook-form");

    const nameInput =
        document.getElementById("guest-name");

    const messageInput =
        document.getElementById("guest-message");

    const entriesContainer =
        document.getElementById("guestbook-entries");

    const emptyMessage =
        document.getElementById("empty-guestbook");

    const countElement =
        document.getElementById("guestbook-count");

    const characterCount =
        document.getElementById("character-count");


    /*
     * If we're not on the guestbook page,
     * stop here.
     */

    if (
        !form ||
        !nameInput ||
        !messageInput ||
        !entriesContainer
    ) {
        return;
    }


    /* =====================================================
       STORAGE
       ===================================================== */

    const STORAGE_KEY =
        "jadeos-strawberry-guestbook";


    function getEntries() {

        try {

            const saved =
                localStorage.getItem(
                    STORAGE_KEY
                );

            return saved
                ? JSON.parse(saved)
                : [];

        } catch {
            return [];
        }
    }


    function saveEntries(entries) {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(entries)
            );

        } catch {
            console.warn(
                "Guestbook entries could not be saved."
            );
        }
    }


    /* =====================================================
       CHARACTER COUNTER
       ===================================================== */

    function updateCharacterCount() {

        const count =
            messageInput.value.length;

        characterCount.textContent =
            count;
    }


    messageInput.addEventListener(
        "input",
        updateCharacterCount
    );

    updateCharacterCount();


    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent = value;

        return div.innerHTML;
    }


    /* =====================================================
       FORMAT DATE
       ===================================================== */

    function formatDate(dateString) {

        const date =
            new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "Just now";
        }


        return date.toLocaleDateString(
            undefined,
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );
    }


    /* =====================================================
       RENDER ENTRIES
       ===================================================== */

    function renderEntries() {

        const entries =
            getEntries();


        /*
         * Remove existing generated entries
         * but keep the empty message.
         */

        entriesContainer
            .querySelectorAll(
                ".guestbook-entry"
            )
            .forEach((entry) => {
                entry.remove();
            });


        /*
         * Empty state
         */

        if (emptyMessage) {

            emptyMessage.style.display =
                entries.length === 0
                    ? "block"
                    : "none";
        }


        /*
         * Update count
         */

        if (countElement) {

            const count =
                entries.length;

            countElement.textContent =
                `${count} ${
                    count === 1
                        ? "note"
                        : "notes"
                }`;
        }


        /*
         * Create entries.
         */

        entries.forEach((entry) => {

            const article =
                document.createElement("article");

            article.className =
                "guestbook-entry";


            const header =
                document.createElement("div");

            header.className =
                "guestbook-entry-header";


            const name =
                document.createElement("span");

            name.className =
                "guestbook-entry-name";

            name.textContent =
                entry.name;


            const date =
                document.createElement("time");

            date.className =
                "guestbook-entry-date";

            date.textContent =
                formatDate(entry.date);


            const message =
                document.createElement("p");

            message.className =
                "guestbook-entry-message";

            /*
             * textContent prevents HTML injection.
             */

            message.textContent =
                entry.message;


            header.appendChild(name);
            header.appendChild(date);

            article.appendChild(header);
            article.appendChild(message);

            entriesContainer.appendChild(article);
        });
    }


    /* =====================================================
       FORM SUBMISSION
       ===================================================== */

    form.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const name =
                nameInput.value.trim();

            const message =
                messageInput.value.trim();


            if (!name || !message) {
                return;
            }


            const entries =
                getEntries();


            const newEntry = {
                id:
                    Date.now(),

                name:
                    name,

                message:
                    message,

                date:
                    new Date().toISOString()
            };


            /*
             * Put newest notes first.
             */

            entries.unshift(newEntry);


            saveEntries(entries);


            /*
             * Reset form.
             */

            form.reset();

            updateCharacterCount();


            /*
             * Re-render entries.
             */

            renderEntries();


            /*
             * Tiny success message.
             */

            showGuestbookMessage();
        }
    );


    /* =====================================================
       SUCCESS MESSAGE
       ===================================================== */

    function showGuestbookMessage() {

        const message =
            document.createElement("div");

        message.className =
            "guestbook-success";

        message.textContent =
            "Your note has been added! 🍓";


        form.prepend(message);


        setTimeout(() => {

            message.remove();

        }, 3000);
    }


    /* =====================================================
       INITIAL RENDER
       ===================================================== */

    renderEntries();

});