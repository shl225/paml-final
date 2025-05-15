"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Gamepad2, DollarSign, Percent, Tags } from "lucide-react"

export default function RecommendationPage() {
  const [appId, setAppId] = useState("")
  const [title, setTitle] = useState("")
  const [genre, setGenre] = useState("")
  const [launchPrice, setLaunchPrice] = useState("")
  const [ownersRange, setOwnersRange] = useState("")
  const [reviewScore, setReviewScore] = useState("")
  const [discountLevel, setDiscountLevel] = useState<number[]>([0])
  const [isAaa, setIsAaa] = useState(false)
  const [hasRecommendation, setHasRecommendation] = useState(false)
  const [recommendedPrice, setRecommendedPrice] = useState(0)
  const [recommendedDiscount, setRecommendedDiscount] = useState(0)

  useEffect(() => console.debug("[state] appId", appId), [appId])

  const handleCompute = async () => {
    const payload =
      appId.trim() !== ""
        ? { app_id: appId.trim() }
        : {
            title,
            genres: genre,
            launch_price: Number(launchPrice),
            owners_range: ownersRange,
            review_score: Number(reviewScore),
            planned_discount: discountLevel[0],
            is_aaa: isAaa ? 1 : 0,
          }
    console.debug("[payload]", payload)
    const res = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    console.debug("[response]", data)
    if (data?.recommended_price) {
      setRecommendedPrice(Number(data.recommended_price.toFixed(2)))
      setRecommendedDiscount(Math.round(data.recommended_discount))
      setHasRecommendation(true)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <Gamepad2 className="w-5 h-5" /> Pricing Recommendation System
          </h1>
          <nav className="ml-auto flex gap-4">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/price-analysis">
              <Button variant="ghost">Price Analysis</Button>
            </Link>
            <Link href="/recommendation">
              <Button variant="ghost" className="font-medium">
                Recommendation
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Tags className="w-6 h-6" /> Pricing Recommendation
        </h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Fill in the details or provide an App ID only</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="grid gap-2">
                <Label htmlFor="app-id">App ID</Label>
                <Input id="app-id" value={appId} onChange={(e) => setAppId(e.target.value)} placeholder="e.g., 570" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Game Title" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="genre">Genre</Label>
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger id="genre">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="action">Action</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="rpg">RPG</SelectItem>
                    <SelectItem value="simulation">Simulation</SelectItem>
                    <SelectItem value="strategy">Strategy</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="launch-price" className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" /> Launch Price
                </Label>
                <Input
                  id="launch-price"
                  value={launchPrice}
                  onChange={(e) => setLaunchPrice(e.target.value)}
                  placeholder="e.g., 29.99"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="owners">Owners Range</Label>
                <Select value={ownersRange} onValueChange={setOwnersRange}>
                  <SelectTrigger id="owners">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-20000">0 – 20 000</SelectItem>
                    <SelectItem value="20000-50000">20 000 – 50 000</SelectItem>
                    <SelectItem value="50000-100000">50 000 – 100 000</SelectItem>
                    <SelectItem value="100000-200000">100 000 – 200 000</SelectItem>
                    <SelectItem value="200000-500000">200 000 – 500 000</SelectItem>
                    <SelectItem value="500000-1000000">500 000 – 1 000 000</SelectItem>
                    <SelectItem value="1000000+">1 000 000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="review-score">Review Score %</Label>
                <Input
                  id="review-score"
                  value={reviewScore}
                  onChange={(e) => setReviewScore(e.target.value)}
                  placeholder="e.g., 85"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="aaa" className="flex items-center gap-2">
                  AAA Publisher
                  <input
                    id="aaa"
                    type="checkbox"
                    checked={isAaa}
                    onChange={(e) => setIsAaa(e.target.checked)}
                    className="h-5 w-5 accent-primary"
                  />
                </Label>
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="discount" className="flex items-center gap-1">
                <Percent className="w-4 h-4" /> Planned Discount: {discountLevel[0]}%
              </Label>
              <Slider id="discount" min={0} max={90} step={5} value={discountLevel} onValueChange={setDiscountLevel} className="mt-2" />
            </div>

            <Button className="mt-6" onClick={handleCompute}>
              Compute Recommendation
            </Button>
          </CardContent>
        </Card>

        {hasRecommendation && (
          <>
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Price</CardTitle>
                  <CardDescription>Optimal list price</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-center py-6">${recommendedPrice}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Discount</CardTitle>
                  <CardDescription>Optimal promotion discount</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-center py-6">{recommendedDiscount}%</div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
