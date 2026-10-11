export async function handler(event) {
    const { name, phone, message } = JSON.parse(event.body);
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: process.env.CHAT_ID,
            text: `🔔 Нова заявка
👤 Ім'я: ${name}
📞 Телефон: ${phone}
💬 Повідомлення: ${message || "—"}`
        })
    });
    return { statusCode: 200, body: "OK" };
}