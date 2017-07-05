setTimeout(() => {
    const target = $("[title=Inbox]").first().next().next()[0];

    const unreadObserver = new MutationObserver(() => {
        updateBadge(target.textContent);
    });

    const newNotificationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                Array.prototype.forEach.call(mutation.addedNodes, (node) => {
                    if (node.getAttribute("ispopup") === "1") {
                        const element = $(node);

                        if (harvestNotifications(element)) {
                            attachPopupObserver(element.children().children()[0]);
                        }
                    }
                });
            }
        });
    });

    function harvestNotifications(node) {
        const root = $(node).find(".headerMenuDropShadow");

        let info = [];

        info = root.find("> button > span")
            .map((index, element) => {
                return element.textContent;
            }).toArray();

        if (info.length) {
            info.shift();

            showNotification(info);
        }

        root.find("[aria-label=Reminders] > div > div > div").each((index, element) => {
            info = $(element).find("div > span > span")
                .map((index, element) => {
                    return element.textContent;
                }).toArray();

            if (info.length) {
                info.push($(element).find("div > span > div > div:not([style*='display: none']) > span")
                    .map((index, element) => {
                        return element.textContent;
                    }).toArray().join(" "));
            }

            showNotification(info);
        });

        return !!root.length;
    }

    function attachPopupObserver(node) {
        const popupMutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                Array.prototype.forEach.call(mutation.addedNodes, (node) => {
                    harvestNotifications(node);
                });
            });
        });

        popupMutationObserver.observe(node, { childList: true });
    }

    function showNotification(info) {
        new Notification(info[0], {
            icon: "http://i.imgur.com/lJ4LbVp.png",
            body: `Subject: ${info[1]}\n${info[2]}`
        });
    }

    function updateBadge(count) {
        document.title = document.title.replace(/^\(\d+\)/g, "");

        if (count) {
            document.title = `(${count}) ${document.title}`;
        }
    }

    const popups = $("body > [ispopup=1]");

    popups.each((index, node) => {
        const element = $(node);

        if (harvestNotifications(element)) {
            attachPopupObserver(element.children().children()[0]);
        }
    });

    updateBadge(target.textContent);

    unreadObserver.observe(target, { subtree: true, characterData: true });

    newNotificationObserver.observe(document.body, { childList: true });
}, 3000);
