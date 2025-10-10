export function Hero() {
  return (
    <section className="relative">
      <div className="container mx-auto px-4 pt-6 md:pt-10">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-3xl md:text-5xl font-semibold text-pretty leading-tight">Bold. Graphic. Oversized.</h1>
            <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground max-w-prose">
              Make waves with StyleWav. Street-ready tees and oversized fits crafted for comfort and attitude.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm"
              >
                Shop Men
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm"
              >
                Shop Women
              </a>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img
              src={`/placeholder.svg?height=520&width=780&query=hero+tshirt+model`}
              alt="Hero banner showing StyleWav graphic tees"
              className="w-full rounded-lg border border-border object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
