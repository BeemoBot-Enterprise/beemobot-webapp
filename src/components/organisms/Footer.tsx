import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#1d202b] py-8 mt-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-base font-semibold mb-3">Teemo Bot</h3>
            <p className="text-gray-400 text-xs">
              Le meilleur bot discord pour les joueurs de League of Legends.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-3">Documentation</h3>
            <ul className="space-y-1 text-gray-400 text-xs">
              <li>
                <Link
                  href="/documentation/installation"
                  className="hover:text-white"
                >
                  Installation
                </Link>
              </li>
              <li>
                <Link
                  href="/documentation/features"
                  className="hover:text-white"
                >
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link href="/documentation/api" className="hover:text-white">
                  API
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-3">Ressources</h3>
            <ul className="space-y-1 text-gray-400 text-xs">
              <li>
                <Link href="/resources/sponsors" className="hover:text-white">
                  Sponsors
                </Link>
              </li>
              <li>
                <Link href="/resources/contribute" className="hover:text-white">
                  Contribuer
                </Link>
              </li>
              <li>
                <Link href="/resources/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-3">Légal</h3>
            <ul className="space-y-1 text-gray-400 text-xs">
              <li>
                <Link href="/legal/terms" className="hover:text-white">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-white">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="hover:text-white">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-xs text-gray-400 mb-3 md:mb-0">
            © {new Date().getFullYear()} Teemo Bot. Tous droits réservés.
          </div>
          <div className="flex space-x-3">
            {/* Social icons... */}
            {/* ...existing code... */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
