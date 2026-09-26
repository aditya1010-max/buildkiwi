/**
 * Test Scope
 * ----------
 * Handles SVG element building and document serialization.
 *
 * Covers:
 * - SVG element serialization
 * - Element attributes
 * - Gradient serialization
 * - Attribute escaping
 * - SVG document structure
 * - SVG dimensions and viewBox
 *
 * Does not cover:
 * - Pattern generation
 * - Layout
 * - Theme resolution
 * - Visual budgets
 */

import { describe, expect, it } from "vitest";

import {
  circle,
  rectangle,
  polygon,
  line,
  path,
  linearGradient,
  radialGradient,
} from "../src/svg/builder";

import { serializeSvg } from "../src/svg/serialize";

describe("svg", () => {
  describe("element builders", () => {
    it("serializes basic SVG shapes", () => {
      expect(
        circle({
          type: "circle",
          cx: 50,
          cy: 40,
          radius: 20,
          fill: "#ff0000",
        }),
      ).toContain('<circle cx="50" cy="40" r="20" fill="#ff0000"');

      expect(
        rectangle({
          type: "rectangle",
          x: 10,
          y: 20,
          width: 100,
          height: 50,
          fill: "#00ff00",
        }),
      ).toContain('<rect x="10" y="20" width="100" height="50" fill="#00ff00"');

      expect(
        line({
          type: "line",
          x1: 0,
          y1: 10,
          x2: 100,
          y2: 50,
          stroke: "#000000",
        }),
      ).toContain('<line x1="0" y1="10" x2="100" y2="50" stroke="#000000"');
    });

    it("serializes polygons and paths", () => {
      expect(
        polygon({
          type: "polygon",
          points: [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 5, y: 10 },
          ],
          fill: "#123456",
        }),
      ).toContain('<polygon points="0,0 10,0 5,10" fill="#123456"');

      expect(
        path({
          type: "path",
          d: "M 0 0 L 10 10",
          fill: "none",
        }),
      ).toContain('<path d="M 0 0 L 10 10" fill="none"');
    });

    it("serializes optional attributes when provided", () => {
      const result = circle({
        type: "circle",
        cx: 10,
        cy: 20,
        radius: 5,
        fill: "#fff",
        opacity: 0.5,
        stroke: "#000",
        strokeWidth: 2,
      });

      expect(result).toContain('opacity="0.5"');
      expect(result).toContain('stroke="#000"');
      expect(result).toContain('stroke-width="2"');
    });
  });

  describe("gradients", () => {
    const stops = [
      { offset: 0, color: "#000000" },
      { offset: 1, color: "#ffffff" },
    ];

    it("serializes a linear gradient", () => {
      const result = linearGradient({
        type: "linear-gradient",
        id: "gradient",
        x1: 0,
        y1: 0,
        x2: 1,
        y2: 1,
        stops,
      });

      expect(result).toContain(
        '<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">',
      );
      expect(result).toContain('<stop offset="0%" stop-color="#000000"');
      expect(result).toContain('<stop offset="100%" stop-color="#ffffff"');
      expect(result).toContain("</linearGradient>");
    });

    it("serializes a radial gradient", () => {
      const result = radialGradient({
        type: "radial-gradient",
        id: "radial",
        cx: 0.5,
        cy: 0.5,
        radius: 1,
        stops,
      });

      expect(result).toContain(
        '<radialGradient id="radial" cx="50%" cy="50%" r="100%">',
      );
      expect(result).toContain("</radialGradient>");
    });
  });

  describe("escaping", () => {
    it("escapes special characters in attributes", () => {
      const result = path({
        type: "path",
        d: 'M 0 0 <test> & "value"',
      });

      expect(result).toContain(
        'd="M 0 0 &lt;test&gt; &amp; &quot;value&quot;"',
      );
    });
  });

  describe("serializeSvg", () => {
    it("serializes a complete SVG document", () => {
      const result = serializeSvg(
        {
          elements: [
            {
              type: "circle",
              cx: 50,
              cy: 50,
              radius: 20,
              fill: "#ff0000",
            },
          ],
        },
        {
          width: 200,
          height: 100,
        },
      );

      expect(result.svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
      expect(result.svg).toContain('width="200"');
      expect(result.svg).toContain('height="100"');
      expect(result.svg).toContain('viewBox="0 0 200 100"');
      expect(result.svg).toContain("</svg>");

      expect(result.width).toBe(200);
      expect(result.height).toBe(100);
    });

    it("includes background and definitions when provided", () => {
      const result = serializeSvg(
        {
          definitions: [
            {
              type: "linear-gradient",
              id: "background-gradient",
              x1: 0,
              y1: 0,
              x2: 1,
              y2: 1,
              stops: [
                { offset: 0, color: "#000" },
                { offset: 1, color: "#fff" },
              ],
            },
          ],
          elements: [],
        },
        {
          width: 300,
          height: 200,
          background: "#ffffff",
        },
      );

      expect(result.svg).toContain("<defs>");
      expect(result.svg).toContain("background-gradient");
      expect(result.svg).toContain(
        '<rect width="100%" height="100%" fill="#ffffff"',
      );
    });

    it("serializes multiple element types", () => {
      const result = serializeSvg(
        {
          elements: [
            {
              type: "circle",
              cx: 10,
              cy: 10,
              radius: 5,
            },
            {
              type: "rectangle",
              x: 20,
              y: 20,
              width: 30,
              height: 40,
            },
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 50,
              y2: 50,
            },
          ],
        },
        {
          width: 100,
          height: 100,
        },
      );

      expect(result.svg).toContain("<circle");
      expect(result.svg).toContain("<rect");
      expect(result.svg).toContain("<line");
    });
  });
});
