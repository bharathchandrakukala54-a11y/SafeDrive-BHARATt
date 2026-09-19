"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import type { DetectedObject } from "@/types/detection";
import { Camera, CameraOff, Loader2 } from "lucide-react";

export interface CameraFeedRef {
  startCamera: () => void;
  stopCamera: () => void;
}

interface CameraFeedProps {
  onDetect: (objects: DetectedObject[]) => void;
  enabled?: boolean;
}

type ModelStatus = "idle" | "loading" | "ready" | "error";
type CameraStatus =
  | "idle"
  | "requesting"
  | "active"
  | "denied"
  | "unavailable"
  | "error";

const FRAME_SKIP = 6; // run detection every N animation frames (~5-10fps at 60fps)

const BOX_COLORS: Record<string, string> = {
  person: "#4edea3",       // secondary
  car: "#00f0ff",          // primary
  truck: "#00dbe9",
  bus: "#00dbe9",
  bicycle: "#7df4ff",
  motorcycle: "#ffb95f",   // amber
  cat: "#ffb95f",
  dog: "#ffb95f",
  default: "#dbfcff",
};

function getColor(label: string): string {
  return BOX_COLORS[label] ?? BOX_COLORS.default;
}

export const CameraFeed = forwardRef<CameraFeedRef, CameraFeedProps>(
  ({ onDetect, enabled = true }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const modelRef = useRef<cocoSsd.ObjectDetection | null>(null);
    const frameCountRef = useRef(0);

    const [modelStatus, setModelStatus] = useState<ModelStatus>("idle");
    const [cameraStatus, setCameraStatus] = useState<CameraStatus>("idle");
    const [modelLoadMs, setModelLoadMs] = useState<number | null>(null);

    // Load the COCO-SSD model once on mount
    useEffect(() => {
      let cancelled = false;
      async function loadModel() {
        setModelStatus("loading");
        try {
          // Ensure TF backend is ready
          await tf.ready();
          const t0 = performance.now();
          const model = await cocoSsd.load({ base: "lite_mobilenet_v2" });
          if (cancelled) return;
          modelRef.current = model;
          setModelLoadMs(Math.round(performance.now() - t0));
          setModelStatus("ready");
        } catch (err) {
          console.error("[CameraFeed] Model load failed:", err);
          if (!cancelled) setModelStatus("error");
        }
      }
      loadModel();
      return () => {
        cancelled = true;
      };
    }, []);

    const stopCamera = useCallback(() => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      // Clear canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
      setCameraStatus("idle");
      onDetect([]);
    }, [onDetect]);

    const runDetectionLoop = useCallback(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const model = modelRef.current;
      if (!video || !canvas || !model || video.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(runDetectionLoop);
        return;
      }

      frameCountRef.current += 1;
      if (frameCountRef.current % FRAME_SKIP === 0) {
        // Sync canvas size to video
        if (
          canvas.width !== video.videoWidth ||
          canvas.height !== video.videoHeight
        ) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          animFrameRef.current = requestAnimationFrame(runDetectionLoop);
          return;
        }

        model
          .detect(video)
          .then((predictions) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const now = Date.now();
            const detected: DetectedObject[] = [];

            for (const pred of predictions) {
              if (pred.score < 0.45) continue; // skip low-confidence

              const [bx, by, bw, bh] = pred.bbox;
              const color = getColor(pred.class);

              // Draw bounding box
              ctx.strokeStyle = color;
              ctx.lineWidth = 2;
              ctx.shadowColor = color;
              ctx.shadowBlur = 6;
              ctx.strokeRect(bx, by, bw, bh);
              ctx.shadowBlur = 0;

              // Corner accent marks
              const cs = 12;
              ctx.lineWidth = 3;
              [[bx, by], [bx + bw, by], [bx, by + bh], [bx + bw, by + bh]].forEach(
                ([cx, cy], i) => {
                  ctx.beginPath();
                  ctx.moveTo(cx + (i % 2 === 0 ? cs : -cs), cy);
                  ctx.lineTo(cx, cy);
                  ctx.lineTo(cx, cy + (i < 2 ? cs : -cs));
                  ctx.stroke();
                }
              );

              // Label background
              const label = `${pred.class} ${(pred.score * 100).toFixed(0)}%`;
              ctx.font = "bold 11px 'JetBrains Mono', monospace";
              const textW = ctx.measureText(label).width;
              const padding = 4;
              const tagH = 18;
              const tagY = by > tagH + 4 ? by - tagH - 2 : by + bh + 2;
              ctx.fillStyle = "rgba(10,14,22,0.85)";
              ctx.fillRect(bx, tagY, textW + padding * 2, tagH);
              ctx.strokeStyle = color;
              ctx.lineWidth = 1;
              ctx.strokeRect(bx, tagY, textW + padding * 2, tagH);

              // Label text
              ctx.fillStyle = color;
              ctx.fillText(label, bx + padding, tagY + 13);

              detected.push({
                label: pred.class,
                confidence: pred.score,
                bbox: [bx, by, bw, bh],
                timestamp: now,
              });
            }

            onDetect(detected);
          })
          .catch(() => {/* silently swallow single-frame errors */});
      }

      animFrameRef.current = requestAnimationFrame(runDetectionLoop);
    }, [onDetect]);

    const startCamera = useCallback(async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraStatus("unavailable");
        return;
      }
      setCameraStatus("requesting");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setCameraStatus("active");
        frameCountRef.current = 0;
        animFrameRef.current = requestAnimationFrame(runDetectionLoop);
      } catch (err: unknown) {
        console.error("[CameraFeed] Camera access error:", err);
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("denied") || msg.includes("NotAllowed")) {
          setCameraStatus("denied");
        } else if (msg.includes("NotFound") || msg.includes("DevicesNotFound")) {
          setCameraStatus("unavailable");
        } else {
          setCameraStatus("error");
        }
      }
    }, [runDetectionLoop]);

    // Expose imperative handle
    useImperativeHandle(ref, () => ({ startCamera, stopCamera }), [
      startCamera,
      stopCamera,
    ]);

    // Auto-start when model is ready and enabled
    useEffect(() => {
      if (enabled && modelStatus === "ready" && cameraStatus === "idle") {
        startCamera();
      }
      if (!enabled && cameraStatus === "active") {
        stopCamera();
      }
    }, [enabled, modelStatus, cameraStatus, startCamera, stopCamera]);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        stopCamera();
      };
    }, [stopCamera]);

    const isActive = cameraStatus === "active";

    return (
      <div className="relative w-full h-full bg-surface-container-lowest rounded-xl overflow-hidden border border-surface-container-high/60">
        {/* Live video element */}
        <video
          ref={videoRef}
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isActive ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Canvas overlay for bounding boxes */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Status overlays */}
        {!isActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
            {cameraStatus === "requesting" || modelStatus === "loading" ? (
              <>
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="font-mono text-xs text-primary-fixed-dim">
                  {modelStatus === "loading"
                    ? "LOADING COCO-SSD MODEL..."
                    : "REQUESTING CAMERA..."}
                </span>
              </>
            ) : cameraStatus === "denied" ? (
              <>
                <CameraOff className="w-8 h-8 text-error" />
                <span className="font-mono text-xs text-error text-center px-4">
                  CAMERA PERMISSION DENIED
                </span>
                <span className="font-mono text-[10px] text-on-surface-variant text-center px-4">
                  Allow camera access in browser settings, then reload.
                </span>
              </>
            ) : cameraStatus === "unavailable" ? (
              <>
                <CameraOff className="w-8 h-8 text-tertiary-fixed-dim" />
                <span className="font-mono text-xs text-tertiary-fixed-dim text-center px-4">
                  NO CAMERA DETECTED
                </span>
                <span className="font-mono text-[10px] text-on-surface-variant text-center px-4">
                  Connect a camera or use a device with a webcam.
                </span>
              </>
            ) : cameraStatus === "error" ? (
              <>
                <CameraOff className="w-8 h-8 text-error" />
                <span className="font-mono text-xs text-error text-center px-4">
                  CAMERA ERROR — RETRYING...
                </span>
                <button
                  onClick={startCamera}
                  className="mt-1 px-3 py-1.5 bg-primary-container text-on-primary-container text-xs font-mono rounded-md cursor-pointer"
                >
                  RETRY
                </button>
              </>
            ) : modelStatus === "error" ? (
              <>
                <CameraOff className="w-8 h-8 text-error" />
                <span className="font-mono text-xs text-error text-center px-4">
                  MODEL LOAD FAILED
                </span>
                <span className="font-mono text-[10px] text-on-surface-variant text-center px-4">
                  Check network connection or browser compatibility.
                </span>
              </>
            ) : (
              <>
                <Camera className="w-8 h-8 text-on-surface-variant" />
                <span className="font-mono text-xs text-on-surface-variant">
                  CAMERA INITIALIZING...
                </span>
              </>
            )}
          </div>
        )}

        {/* Status badge (top-left) */}
        {isActive && (
          <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 bg-surface-container-lowest/90 backdrop-blur-md px-2 py-1 rounded-md border border-primary/30">
            <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
            <span className="font-mono text-[9px] text-error font-bold tracking-widest">
              LIVE
            </span>
            {modelLoadMs !== null && (
              <span className="font-mono text-[9px] text-on-surface-variant">
                · MODEL {modelLoadMs}ms
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

CameraFeed.displayName = "CameraFeed";
