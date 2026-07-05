self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "La Boutique des Artisans", body: event.data?.text() };
  }

  event.waitUntil(
    self.registration.showNotification(
      data.title || "La Boutique des Artisans",
      {
        body: data.body || "",
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        data: { url: data.url || "/nouveautes" },
      }
    )
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/nouveautes";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
