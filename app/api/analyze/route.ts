import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const payload = await req.json();

  return new Promise<NextResponse>((resolve) => {
    const py = spawn(
      "python",
      [path.join(process.cwd(), "backend", "analyze_backend.py")],
      { env: process.env }
    );

    let out = "";
    py.stdout.on("data", (d) => { out += d.toString(); });
    py.stderr.on("data", (e) => console.error("[analyze.py]", e.toString()));

    py.stdin.write(JSON.stringify(payload));
    py.stdin.end();

    py.on("close", () => {
      try {
        const data = JSON.parse(out);
        resolve(NextResponse.json(data));
      } catch (err) {
        resolve(
          NextResponse.json({ error: "Analysis failed" }, { status: 500 })
        );
      }
    });
  });
}
