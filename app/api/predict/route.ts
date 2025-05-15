// app/api/predict/route.ts
import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  console.debug("[route] Received POST /api/predict");
  const payload = await req.json();
  console.debug("[route] Payload:", payload);

  return new Promise<NextResponse>((resolve) => {
    const scriptPath = path.join(process.cwd(), "backend", "predict_backend.py");
    console.debug("[route] Spawning python:", scriptPath);
    const py = spawn("python", [scriptPath], { env: { ...process.env } });

    let out = "";
    py.stdout.on("data", (data) => {
      const chunk = data.toString();
      console.debug("[route] stdout chunk:", chunk);
      out += chunk;
    });
    py.stderr.on("data", (err) => {
      console.error("[route-py-stderr]", err.toString());
    });

    console.debug("[route] Writing payload to python stdin");
    py.stdin.write(JSON.stringify(payload));
    py.stdin.end();

    py.on("close", (code) => {
      console.debug("[route] Python exited with code", code);
      console.debug("[route] Raw stdout:", out);
      try {
        const data = JSON.parse(out);
        console.debug("[route] Parsed response:", data);
        resolve(NextResponse.json(data));
      } catch (err) {
        console.error("[route] Parse error:", err, "stdout=", out);
        resolve(
          NextResponse.json({ error: "Prediction failed" }, { status: 500 })
        );
      }
    });
  });
}
