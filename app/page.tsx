import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold">Pricing Recommendation System</h1>
          <nav className="ml-auto flex gap-4">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/price-analysis">
              <Button variant="ghost">Price Analysis</Button>
            </Link>
            <Link href="/recommendation">
              <Button variant="ghost">Recommendation</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              Historical Pricing Analysis & Recommendation Tool
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore historical discount data and generate pricing recommendations based on market trends.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Price Analysis</CardTitle>
                <CardDescription>View historical discount charts and analyze pricing trends</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Explore historical pricing data with interactive charts. Filter by genre, owners, and other parameters
                  to gain insights into effective pricing strategies.
                </p>
                <Link href="/price-analysis">
                  <Button>Go to Price Analysis</Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pricing Recommendation</CardTitle>
                <CardDescription>Get AI-powered pricing and discount suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Receive data-driven recommendations for optimal pricing and discount strategies based on historical
                  performance and market conditions.
                </p>
                <Link href="/recommendation">
                  <Button>Go to Recommendation</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
