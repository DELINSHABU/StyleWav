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
              <a href="#" className="hover:opacity-80">
                Shipping
              </a>
            </li>
            <li>
              <a href="#" className="hover:opacity-80">
                Returns
              </a>
            </li>
            <li>
              <a href="#" className="hover:opacity-80">
                Support
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium">Company</h4>
          <ul className="mt-2 space-y-2">
            <li>
              <a href="#" className="hover:opacity-80">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:opacity-80">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:opacity-80">
                Contact
              </a>
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
