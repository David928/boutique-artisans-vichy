export const metadata = {
  title: "Infos pratiques — La Boutique des Artisans Vichy",
};

export default function InfosPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-semibold text-ink">Infos pratiques</h1>

      <p className="mt-3 text-sm text-ink-light">
        Cette application vous fait découvrir les artisans de la boutique,
        leurs nouveautés et leurs plus beaux produits.
      </p>

      <p className="mt-4 text-sm text-ink-light">
        Mais rien ne remplace une visite : n&apos;hésitez pas à passer nous
        voir en boutique pour explorer l&apos;univers complet de chacun !
      </p>

      <div className="mt-5 rounded-xl border border-ink/10 bg-cream-light px-4 py-4 text-sm text-ink-light">
        <p className="font-semibold text-ink">Retrouvez-nous :</p>
        <p className="mt-1">
          📍 Centre Commercial Les 4 Chemins
          <br />
          35 rue Lucas
          <br />
          03200 Vichy
        </p>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Centre+Commercial+Les+4+Chemins+35+rue+Lucas+03200+Vichy"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block rounded-full bg-vichy px-4 py-1.5 text-xs font-medium text-white transition hover:bg-vichy-light"
        >
          Voir l&apos;itinéraire →
        </a>
        <p className="mt-4 font-semibold text-ink">
          🕒 Nos horaires d&apos;ouverture :
        </p>
        <ul className="mt-1 space-y-0.5">
          <li>• Lundi : 14h00 à 19h00</li>
          <li>• Mardi au samedi : 9h30 à 19h00</li>
          <li>• Dimanche : 14h30 à 19h00</li>
        </ul>
      </div>

      <div className="mt-5 rounded-xl border border-ink/10 bg-cream-light px-4 py-4 text-sm text-ink-light">
        <p className="font-semibold text-ink">📱 Installer l&apos;application</p>
        <p className="mt-1">
          Ce site est une <strong>web app</strong> : pas besoin de passer par
          l&apos;App Store ou le Play Store. Vous pouvez l&apos;ajouter à
          l&apos;écran d&apos;accueil de votre téléphone pour l&apos;ouvrir
          comme une vraie application, en plein écran.
        </p>

        <p className="mt-4 font-semibold text-ink">Sur iPhone (Safari)</p>
        <ol className="mt-1 list-decimal space-y-0.5 pl-5">
          <li>Ouvrez ce site dans Safari</li>
          <li>
            Appuyez sur le bouton <strong>Partager</strong> (le carré avec une
            flèche vers le haut, en bas de l&apos;écran)
          </li>
          <li>
            Choisissez <strong>« Sur l&apos;écran d&apos;accueil »</strong>
          </li>
          <li>
            Appuyez sur <strong>Ajouter</strong>
          </li>
        </ol>

        <p className="mt-4 font-semibold text-ink">Sur Android (Chrome)</p>
        <ol className="mt-1 list-decimal space-y-0.5 pl-5">
          <li>Ouvrez ce site dans Chrome</li>
          <li>
            Appuyez sur le menu <strong>⋮</strong> (trois points, en haut à
            droite)
          </li>
          <li>
            Choisissez <strong>« Installer l&apos;application »</strong> (ou
            « Ajouter à l&apos;écran d&apos;accueil »)
          </li>
          <li>
            Confirmez avec <strong>Installer</strong>
          </li>
        </ol>
      </div>
    </div>
  );
}
