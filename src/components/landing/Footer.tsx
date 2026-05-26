import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  product: [
    { name: "How It Works", href: "/how-it-works" },
    { name: "Pricing", href: "/pricing" },
    { name: "Tools", href: "/tools" },
    { name: "IndexNow", href: "/indexnow" },
  ],
  resources: [
    { name: "Docs", href: "/docs" },
    { name: "Blog", href: "/blog" },
    { name: "Status", href: "/status" },
  ],
  company: [
    { name: "About", href: "/how-it-works" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Image
                src="/logo.png"
                alt="IndexFast"
                width={24}
                height={24}
                className="rounded"
              />
              <span className="text-sm font-bold">IndexFast</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Automated indexing for modern content teams.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              Product
            </h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              Resources
            </h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              Company
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} IndexFast Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
