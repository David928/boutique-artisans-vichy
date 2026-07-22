const SITE_URL = "https://boutique-artisans-vichy.vercel.app";
const FROM_EMAIL = "boutique@gravetincelle.com";
const FROM_NAME = "La Boutique des Artisans";

export async function sendArtisanWelcomeEmail({
  to,
  artisanName,
  password,
  slug,
}: {
  to: string;
  artisanName: string;
  password: string;
  slug: string;
}): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return { sent: false, error: "BREVO_API_KEY non configurée." };
  }

  const loginUrl = `${SITE_URL}/admin/login`;
  const ficheUrl = `${SITE_URL}/artisans/${slug}`;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { email: FROM_EMAIL, name: FROM_NAME },
      to: [{ email: to, name: artisanName }],
      subject: "Votre accès à La Boutique des Artisans Vichy",
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #4a3a2c;">
          <img src="${SITE_URL}/logo.png" alt="La Boutique des Artisans Vichy" style="width: 220px; margin-bottom: 24px;" />
          <h1 style="font-size: 20px;">Bienvenue, ${artisanName} !</h1>
          <p>Votre fiche a été créée sur l'application de la Boutique des Artisans à Vichy. Voici vos identifiants de connexion :</p>
          <table style="margin: 16px 0; font-size: 14px;">
            <tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">Email</td><td>${to}</td></tr>
            <tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">Mot de passe provisoire</td><td style="font-family: monospace;">${password}</td></tr>
          </table>
          <p>
            <a href="${loginUrl}" style="display: inline-block; background: #4a3a2c; color: #f7f2e7; padding: 10px 20px; border-radius: 999px; text-decoration: none;">
              Se connecter
            </a>
          </p>
          <p style="font-size: 13px; color: #6b5744;">
            Une fois connecté·e, pensez à changer ce mot de passe depuis votre tableau de bord
            (bouton "Changer mon mot de passe" à côté de "Enregistrer ma fiche").
          </p>
          <p style="font-size: 13px; color: #6b5744;">
            Votre fiche publique : <a href="${ficheUrl}">${ficheUrl}</a>
          </p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    return { sent: false, error: `Brevo (${response.status}): ${body}` };
  }

  return { sent: true };
}

export async function sendArtisanPasswordResetEmail({
  to,
  artisanName,
  password,
}: {
  to: string;
  artisanName: string;
  password: string;
}): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return { sent: false, error: "BREVO_API_KEY non configurée." };
  }

  const loginUrl = `${SITE_URL}/admin/login`;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { email: FROM_EMAIL, name: FROM_NAME },
      to: [{ email: to, name: artisanName }],
      subject: "Votre nouveau mot de passe — La Boutique des Artisans Vichy",
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #4a3a2c;">
          <img src="${SITE_URL}/logo.png" alt="La Boutique des Artisans Vichy" style="width: 220px; margin-bottom: 24px;" />
          <h1 style="font-size: 20px;">Bonjour ${artisanName},</h1>
          <p>Votre mot de passe vient d'être réinitialisé. Voici vos nouveaux identifiants de connexion :</p>
          <table style="margin: 16px 0; font-size: 14px;">
            <tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">Email</td><td>${to}</td></tr>
            <tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">Nouveau mot de passe</td><td style="font-family: monospace;">${password}</td></tr>
          </table>
          <p>
            <a href="${loginUrl}" style="display: inline-block; background: #4a3a2c; color: #f7f2e7; padding: 10px 20px; border-radius: 999px; text-decoration: none;">
              Se connecter
            </a>
          </p>
          <p style="font-size: 13px; color: #6b5744;">
            Une fois connecté·e, pensez à changer ce mot de passe depuis votre tableau de bord
            (bouton "Changer mon mot de passe" à côté de "Enregistrer ma fiche").
          </p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    return { sent: false, error: `Brevo (${response.status}): ${body}` };
  }

  return { sent: true };
}
