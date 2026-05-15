type SendMagicLinkEmailInput = {
  to: string;
  name: string;
  magicLink: string;
};

export async function sendMagicLinkEmail({ to, name, magicLink }: SendMagicLinkEmailInput) {
  if (!process.env.RESEND_API_KEY || !process.env.MAGIC_LINK_FROM) {
    console.info(`Magic link for ${to}: ${magicLink}`);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: process.env.MAGIC_LINK_FROM,
      to,
      subject: "Seu acesso aos Clones da Bíblia",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #17201d;">
          <h1>Seu link de acesso</h1>
          <p>Olá, ${escapeHtml(name)}.</p>
          <p>Clique no botão abaixo para entrar nos Clones da Bíblia. Este link expira em 15 minutos.</p>
          <p>
            <a href="${magicLink}" style="display:inline-block;background:#b78937;color:#17201d;padding:12px 18px;text-decoration:none;font-weight:bold;border-radius:6px;">
              Acessar minha conta
            </a>
          </p>
          <p>Se o botão não funcionar, copie e cole este link no navegador:</p>
          <p><a href="${magicLink}">${magicLink}</a></p>
        </div>
      `
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Falha ao enviar link magico: ${errorText}`);
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
