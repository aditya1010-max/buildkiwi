import { describe, expect, it } from "vitest";
import { serializeSvg } from "../src/svg/serialize";

describe("serializeSvg", () => {
  it("serializes pattern primitives into an SVG", () => {
    const result = serializeSvg(
      {
        elements: [
          {
            type: "circle",
            cx: 50,
            cy: 50,
            radius: 20,
            fill: "#ff0000",
            opacity: 0.12,
          },
          {
            type: "rectangle",
            x: 100,
            y: 100,
            width: 40,
            height: 30,
            fill: "#0000ff",
          },
        ],
      },
      {
        width: 512,
        height: 512,
        borderRadius: 16,
        background: "#ffffff",
      },
    );

    expect(result.width).toBe(512);
    expect(result.height).toBe(512);

    expect(result.svg).toContain("<svg");
    expect(result.svg).toContain("<circle");
    expect(result.svg).toContain("<rect");
    expect(result.svg).toContain('fill="#ff0000"');
    expect(result.svg).toContain('fill="#0000ff"');
    expect(result.svg).toContain('opacity="0.12"');
    expect(result.svg).toContain('rx="16"');
    expect(result.svg).toContain('ry="16"');
  });

  it("serializes gradient definitions", () => {
    const result = serializeSvg(
      {
        definitions: [
          {
            type: "linear-gradient",
            id: "test-gradient",
            x1: 0,
            y1: 0,
            x2: 1,
            y2: 1,
            stops: [
              {
                offset: 0,
                color: "#ff0000",
              },
              {
                offset: 1,
                color: "#0000ff",
              },
            ],
          },
        ],
        elements: [
          {
            type: "rectangle",
            x: 0,
            y: 0,
            width: 512,
            height: 512,
            fill: "url(#test-gradient)",
          },
        ],
      },
      {
        width: 512,
        height: 512,
        borderRadius: 999,
      },
    );

    expect(result.svg).toContain("<defs>");
    expect(result.svg).toContain("<linearGradient");
    expect(result.svg).toContain('id="test-gradient"');
    expect(result.svg).toContain('stop-color="#ff0000"');
    expect(result.svg).toContain('stop-color="#0000ff"');
    expect(result.svg).toContain('fill="url(#test-gradient)"');
  });

  it("produces deterministic SVG for identical output", () => {
    const output = {
      elements: [
        {
          type: "circle" as const,
          cx: 100,
          cy: 100,
          radius: 25,
          fill: "#123456",
        },
      ],
    };

    const options = {
      width: 512,
      height: 512,
      borderRadius: 999,
    };

    const first = serializeSvg(output, options);
    const second = serializeSvg(output, options);

    expect(first.svg).toBe(second.svg);
  });
});
