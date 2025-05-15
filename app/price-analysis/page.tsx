"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function PriceAnalysisPage() {
  const [appId, setAppId] = useState("");
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [owners, setOwners] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    error?: string;
    image_data?: string;
    summary?: string;
  }>({});

  const handleAnalyze = async () => {
    setLoading(true);
    setResult({});
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app_id: appId,
          title,
          genres: genre,
          owners,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Status ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      console.error(e);
      setResult({ error: e.message || "Analysis failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-lg font-semibold">
            Pricing Recommendation System
          </h1>
          <nav className="ml-auto flex gap-4">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/price-analysis">
              <Button variant="ghost" className="font-medium">
                Price Analysis
              </Button>
            </Link>
            <Link href="/recommendation">
              <Button variant="ghost">Recommendation</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <h1 className="text-2xl font-bold mb-6">
          Historical Discount Analysis
        </h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Parameters</CardTitle>
            <CardDescription>Enter at least one field to analyze</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label htmlFor="app-id">App ID</Label>
              <Input
                id="app-id"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
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
            <div>
              <Label htmlFor="owners">Owners Range</Label>
              <Select value={owners} onValueChange={setOwners}>
                <SelectTrigger id="owners">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-20000">0 - 20,000</SelectItem>
                  <SelectItem value="20000-50000">20,000 - 50,000</SelectItem>
                  <SelectItem value="50000-100000">50,000 - 100,000</SelectItem>
                  <SelectItem value="100000-200000">100,000 - 200,000</SelectItem>
                  <SelectItem value="200000-500000">200,000 - 500,000</SelectItem>
                  <SelectItem value="500000-1000000">
                    500,000 - 1,000,000
                  </SelectItem>
                  <SelectItem value="1000000+">1,000,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardContent>
            <Button onClick={handleAnalyze} disabled={loading}>
              {loading ? "Analyzing…" : "Analyze Historical Data"}
            </Button>
          </CardContent>
        </Card>

        {result.error && (
          <p className="text-red-600 font-bold mb-4">{result.error}</p>
        )}

        {result.image_data && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Time Series</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={result.image_data}
                alt="Historical discount time series"
                className="w-full h-auto"
              />
            </CardContent>
          </Card>
        )}

        {result.summary && (
          <Card>
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm">
                {result.summary}
              </pre>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 flex justify-end">
          <Link href="/recommendation">
            <Button>Continue to Recommendation</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
