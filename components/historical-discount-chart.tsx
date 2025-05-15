"use client"

import { ResponsiveContainer } from "@/components/ui/chart"
import { useEffect, useState } from "react"

interface Props {
  appId?: string
  title?: string
  genre?: string
  owners?: string
}

export function HistoricalDiscountChart({ appId, title, genre, owners }: Props) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    setErr(null)
    setImgSrc(null)
    const body = { app_id: appId, title, genres: genre, owners }
    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) setErr(data.error)
        else setImgSrc(data.image_data)
      })
      .catch(() => setErr("Failed to load visualization"))
  }, []) // only on mount

  const imgStyle: React.CSSProperties = {
    height: "fit-content",
    width: "fit-content",
    transform: "scale(0.5)",
    marginTop: "-17%",
  }

  if (err) return <div>{err}</div>
  if (!imgSrc) return <div>Loading...</div>
  return (
    <ResponsiveContainer width="100%" height="100%">
      <img style={imgStyle} src={imgSrc} alt="Historical time series" />
    </ResponsiveContainer>
  )
}
