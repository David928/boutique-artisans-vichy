export const metadata = {
  title: "Infos pratiques — La Boutique des Artisans Vichy",
};

export default function InfosPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-semibold text-ink">Infos pratiques</h1>

      <p className="mt-3 text-sm text-ink-light">
        Cette application vous fait découvrir les artisans de la boutique,
        leurs nouveautés et leurs plus beaux produits. Mais rien ne remplace
        une visite : n&apos;hésitez pas à passer nous voir en boutique pour
        explorer l&apos;univers complet de chacun !
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
        <p className="mt-3 font-semibold text-ink">
          🕒 Nos horaires d&apos;ouverture :
        </p>
        <ul className="mt-1 space-y-0.5">
          <li>• Lundi : 14h00 à 19h00</li>
          <li>• Mardi au samedi : 9h30 à 19h00</li>
          <li>• Dimanche : 14h30 à 19h00</li>
        </ul>
      </div>
    </div>
  );
}
