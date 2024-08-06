// nodeMail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Pour le port 587, ne pas utiliser secure
  auth: {
    user: "gaaloulsahar6@gmail.com", // Assurez-vous que l'adresse email est correcte
    pass: "hzym iwab iual blrd", // Utilisez un mot de passe d'application si nécessaire
  },
});

// Fonction pour envoyer un e-mail
async function sendMail(to, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: '"weefarm" <gaaloulsahar6@gmail.com>', // Adresse de l'expéditeur
      to,
      subject,
      text,
      html,
    });

    console.log("Message envoyé : %s", info.messageId);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail :", error);
    throw error; // Propager l'erreur pour qu'elle puisse être traitée ailleurs
  }
}

// Fonction pour envoyer un e-mail de vérification
async function sendVerificationEmail(to, code) {
  const subject = 'Code de Vérification';
  const text = `Votre code de vérification est : ${code}`;
  const html = `<p>Votre code de vérification est : <strong>${code}</strong></p>`;

  await sendMail(to, subject, text, html);
}
async function sendRegistrationEmail(to, link) {
  const subject = 'Lien d\'Inscription';
  const text = `Veuillez utiliser le lien suivant pour vous inscrire : ${link}`;
  const html = `<p>Veuillez utiliser le lien suivant pour vous inscrire : <a href="${link}">${link}</a></p>`;

  await sendMail(to, subject, text, html);
}


module.exports = { sendMail, sendVerificationEmail , sendRegistrationEmail};
