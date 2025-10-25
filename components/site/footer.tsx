import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 py-10 grid md:grid-cols-4 gap-8 text-sm">
        <div className="md:col-span-2">
          <h3 className="font-semibold">StyleWav</h3>
          <p className="mt-2 text-muted-foreground max-w-prose">
            Streetwear built for comfort and attitude. Graphic tees, oversized fits, and weekly drops.
          </p>
        </div>
        <div>
          <h4 className="font-medium">Help</h4>
          <ul className="mt-2 space-y-2">
            <li>
              <Link href="/shipping" className="hover:opacity-80">
                Shipping
              </Link>
            </li>
            <li>
              <Link href="/returns" className="hover:opacity-80">
                Returns
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:opacity-80">
                Support
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium">Company</h4>
          <ul className="mt-2 space-y-2">
            <li>
              <Link href="/about" className="hover:opacity-80">
                About
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:opacity-80">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:opacity-80">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} StyleWav. All rights reserved.
      </div>
    </footer>
  )
}
