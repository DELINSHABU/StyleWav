import Link from "next/link"

const categories = [
  { slug: "#", title: "Oversized", query: "oversized+tshirt" },
  { slug: "#", title: "Graphic Tees", query: "graphic+tee" },
  { slug: "#", title: "Co-ords", query: "co-ords+set" },
  { slug: "#", title: "New Arrivals", query: "new+arrivals" },
]

export function CategoryTiles() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {categories.map((c) => (
        <Link key={c.title} href={c.slug} className="group">
          <div className="aspect-[4/5] w-full overflow-hidden rounded-lg border border-border">
            <img
              src={`/.jpg?height=560&width=420&query=${encodeURIComponent(c.query)}`}
              alt={`${c.title} category`}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <p className="mt-2 text-sm font-medium">{c.title}</p>
        </Link>
      ))}
    </div>
  )
}
