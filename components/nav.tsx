import Link from "next/link";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#client-work", label: "Client work" },
  { href: "/#ventures", label: "Ventures" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="sticky top-4 z-50 px-4">
      <nav className="glass-panel mx-auto flex max-w-5xl items-center justify-between rounded-2xl border border-white/10 px-6 py-3 shadow-lg shadow-black/30">
        <Link href="/" className="font-display text-lg text-bone">
          Nidesh Kaarthik
        </Link>
        <ul className="hidden items-center gap-6 text-sm text-fog sm:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="transition-colors hover:text-bone">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
