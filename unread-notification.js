setTimeout(() => {
    const target = $("[title=Inbox]").first().next().next()[0];

    const observer = new MutationObserver(function() {
        updateBadge(target.textContent);
    });

    function updateBadge(count) {
        document.title = document.title.replace(/^\(\d+\)/g, "");

        if (count) {
            document.title = `(${count}) ${document.title}`;
        }
    }

    updateBadge(target.textContent);

    observer.observe(target, { subtree: true, characterData: true });
}, 3000);
