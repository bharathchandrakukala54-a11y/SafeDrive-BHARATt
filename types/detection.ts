export interface DetectedObject {
  label: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x, y, width, height] in pixels
  timestamp: number;
}

/** Groups an array of detections by label, returning counts per class */
export function groupByLabel(
  objects: DetectedObject[]
): Record<string, number> {
  return objects.reduce<Record<string, number>>((acc, obj) => {
    acc[obj.label] = (acc[obj.label] ?? 0) + 1;
    return acc;
  }, {});
}

/** Returns a human-readable summary string, e.g. "3 persons, 1 car" */
export function formatDetectionSummary(objects: DetectedObject[]): string {
  const groups = groupByLabel(objects);
  const parts = Object.entries(groups).map(
    ([label, count]) => `${count} ${label}${count > 1 ? "s" : ""}`
  );
  return parts.length > 0 ? parts.join(", ") : "No objects";
}
