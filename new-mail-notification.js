setTimeout(() => {
    const target = $("[title=Inbox]").first().next().next()[0];

    const unreadObserver = new MutationObserver(() => {
        updateBadge(target.textContent || 0);
    });

    const newNotificationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                Array.prototype.forEach.call(mutation.addedNodes, (node) => {
                    if (node.getAttribute("ispopup") === "1") {
                        const info = $(node).find(".headerMenuDropShadow").children().children();

                        if (info.length) {
                            showNotification(info);

                            const popupMutationObserver = new MutationObserver((mutations) => {
                                mutations.forEach((mutation) => {
                                    Array.prototype.forEach.call(mutation.addedNodes, (node) => {
                                        const info = $(node).find(".headerMenuDropShadow").children().children();

                                        showNotification(info);
                                    });
                                });
                            });

                            popupMutationObserver.observe($(node).children().children()[0], { childList: true });
                        }
                    }
                });
            }
        });
    });

    function showNotification(info) {
        new Notification(info[2].textContent, {
            icon: "http://i.imgur.com/lJ4LbVp.png",
            body: `Subject: ${info[3].textContent}\n${info[4].textContent}`
        });
    }

    function updateBadge(count) {
        document.title = document.title.replace(/^\(\d+\)/g, "");

        if (count) {
            document.title = `(${count}) ${document.title}`;
        }
    }

    updateBadge(target.textContent || 0);

    unreadObserver.observe(target, { subtree: true, characterData: true });

    newNotificationObserver.observe(document.body, { childList: true });
}, 3000);
