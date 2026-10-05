# BuildKiwi Pattern Engine — Context

## 1. Purpose

## 2. Core Architecture

## 3. Design Principles

## 4. Asset System

## 5. Pattern System

## 6. Deterministic Randomness

## 7. Cover Generation

## 8. BuildKiwi Integration

## 9. Project Structure

## 10. Public API

## 11. Important Decisions

## 12. Things Not To Do

## 13. Current Status

## 14. Roadmap

## 1. Purpose

`@buildkiwi/pattern-engine` is a TypeScript library inside the BuildKiwi monorepo responsible for generating deterministic SVG assets from a seed.

The engine is designed to create visual assets such as project covers and profile graphics without storing the generated SVG itself. BuildKiwi stores a seed and the pattern engine deterministically recreates the same asset whenever it is rendered.

The engine provides:

- Deterministic, seed-based SVG generation.
- Reusable pattern generators.
- Asset presets for different asset types.
- Composable visual systems including patterns, compositions, themes, layouts, and motifs.
- A small public API that allows the BuildKiwi frontend to request an asset without knowing how it is generated.

The core principle is:

    seed → deterministic generation → SVG

The same input seed and configuration should always produce the same visual output.

## 2. Core Architecture

The pattern engine is organized as a layered generation system. Each layer has a specific responsibility and should remain independent from the layers above and below it.

### Generation Flow

    Asset Request
          ↓
    Asset Resolution
          ↓
    Asset Preset
          ↓
    Pattern Configuration
          ↓
    Pattern Generator
          ↓
    SVG Output

In BuildKiwi, the typical flow is:

    GeneratedCover.tsx
          ↓
    generateAsset({ type: "cover", seed })
          ↓
    assets/generator.ts
          ↓
    assets/resolver.ts
          ↓
    assets/registry.ts
          ↓
    AssetPreset
          ↓
    core/generator.ts
          ↓
    PatternGenerator
          ↓
    SVG

### Layer Responsibilities

#### Assets

The asset layer is the public entry point for generating complete assets.

It is responsible for:

- Receiving an `AssetRequest`.
- Resolving the requested asset type.
- Applying the appropriate asset preset.
- Preparing the configuration required by the core generator.
- Returning the final generated asset.

Files:

    src/assets/
    ├── generator.ts
    ├── registry.ts
    ├── resolver.ts
    └── index.ts

#### Presets

Presets define the default configuration for an asset type.

Examples:

- `coverPreset`
- `profilePreset`

A preset contains a single `PatternId`, dimensions, and optional visual configuration.

`AssetPreset.pattern` is intentionally a single pattern. Presets do not represent collections of patterns.

#### Core Generator

The core generator converts a resolved `PatternConfig` into generated SVG output.

It is responsible for coordinating:

- Pattern generation.
- Seeded randomness.
- Composition.
- Visual style.
- Visual budget.
- Color systems.
- Backgrounds and other visual configuration.

#### Patterns

Patterns are the actual visual generators.

Each pattern implements the `PatternGenerator` interface and produces `PatternOutput`.

Current pattern IDs include:

- `waves`
- `geometric`
- `blobs`
- `constellation`
- `halftone`

Patterns should focus on generating their own visual elements and should not contain asset-level logic.

#### Supporting Systems

The engine also contains reusable systems for:

- Composition
- Layout
- Themes
- Motifs
- Seeded randomness

These systems should remain reusable across multiple patterns and asset types.

### Architectural Principle

The frontend should only request an asset:

    generateAsset({
      type: "cover",
      seed,
    });

The frontend should not decide how the asset is generated.

Pattern selection, composition, styling, randomness, and SVG generation belong inside the pattern engine.

This keeps BuildKiwi's UI independent from the visual-generation implementation and allows the pattern engine to evolve without requiring changes to the frontend.

## 3. Design Principles

The pattern engine should remain simple, deterministic, composable, and independent from the BuildKiwi frontend.

### 3.1 Determinism

The same seed and configuration must produce the same visual output.

Seeded randomness should always be used for generated variation.

Do not use `Math.random()` for asset generation.

If a visual choice depends on randomness, it must come from the engine's seeded random system.

Example:

    seed
      ↓
    SeededRandom
      ↓
    random.pick(...)
      ↓
    deterministic result

### 3.2 Seed-Driven Generation

The seed is the source of identity for a generated asset.

BuildKiwi stores the seed rather than the generated SVG. The engine must therefore be able to reconstruct the same asset from that seed at any time.

A change to the generation algorithm may intentionally change the visual output for existing seeds, but this should be treated as an explicit design change.

### 3.3 Separation of Responsibilities

Each layer should have one clear responsibility.

- Assets decide what type of asset is being generated.
- Presets provide default configuration.
- Patterns generate visual elements.
- Compositions control spatial arrangement.
- Themes control visual/color systems.
- Layout utilities provide reusable positioning logic.
- The core generator coordinates these systems.
- The frontend only requests generated assets.

Avoid moving responsibilities between layers simply to make a local implementation easier.

### 3.4 Keep the Public API Small

The frontend should interact with the engine through a small, stable API.

The primary entry point for asset generation is:

    generateAsset({
      type,
      seed,
    });

Internal implementation details should not leak into BuildKiwi's UI components unless there is a strong reason to expose them.

### 3.5 Prefer Composition Over Large Generators

Patterns should be built from reusable primitives and supporting systems where practical.

Prefer:

    pattern
      + composition
      + theme
      + layout
      + motifs

over large pattern implementations that contain every piece of visual logic themselves.

### 3.6 Avoid Unnecessary Abstraction

Do not introduce abstractions, factories, configuration layers, or generic systems unless they solve a real problem in the engine.

The engine should favor straightforward implementations that are easy to understand and modify.

When a simple implementation works, prefer the simple implementation.

### 3.7 Keep Pattern Implementations Focused

A pattern generator should primarily be responsible for generating its own visual elements.

For example:

- `waves` generates wave-based elements.
- `geometric` generates geometric elements.
- `blobs` generates blob-based elements.

Pattern generators should not contain BuildKiwi-specific business logic, database logic, routing logic, or UI behavior.

### 3.8 Preserve Existing Types When Possible

The existing type system represents intentional architectural boundaries.

Do not change a single-value type into an array or a broader type simply to support a new feature.

For example:

    pattern: PatternId

means a resolved asset configuration contains one selected pattern.

If multiple patterns need to be available, selection should happen during generation and resolve to a single `PatternId` before the pattern generator is called.

### 3.9 Deterministic Variation Over Runtime Randomness

Variation is encouraged, but it must remain reproducible.

For example, a cover may select between:

    waves
    geometric
    blobs

based on the seeded random generator.

It should not select a different pattern every time the component renders.

The desired behavior is:

    same seed → same pattern
    same seed → same composition
    same seed → same visual output

### 3.10 Keep the Engine Frontend-Agnostic

The pattern engine should not depend on React, browser UI state, routing, BuildKiwi components, or application-specific business logic.

It should be usable as an independent TypeScript package.

BuildKiwi consumes the generated result; it does not control the internal generation process.

## 4. Asset System

The asset system is responsible for turning a high-level asset request into a resolved configuration that can be passed to the core pattern generator.

The system currently supports two asset types:

    cover
    profile

### 4.1 Asset Request

An asset is requested using `AssetRequest`:

    type AssetRequest = {
      type: AssetType;
      seed: string;
      pattern?: PatternId;
    };

The minimum required information is:

- `type` — the type of asset to generate.
- `seed` — the deterministic seed used for generation.

A pattern may optionally be provided when explicit pattern selection is required.

Typical BuildKiwi usage:

    generateAsset({
      type: "cover",
      seed,
    });

### 4.2 Asset Types

Asset types are represented by `AssetType`:

    type AssetType = "cover" | "profile";

Each asset type has its own preset.

Current presets:

    coverPreset
    profilePreset

### 4.3 Asset Presets

An `AssetPreset` defines the default configuration for an asset type.

A preset contains:

- Asset type.
- Width.
- Height.
- Default pattern.
- Optional composition.
- Optional visual style.
- Optional color system.
- Optional visual budget.
- Optional background.
- Optional ring configuration.

Example:

    export const coverPreset: AssetPreset = {
      type: "cover",
      width: 1200,
      height: 630,
      pattern: "waves",
    };

### 4.4 Preset Registry

All asset presets are registered in:

    src/assets/registry.ts

The registry maps an `AssetType` to its corresponding `AssetPreset`.

Conceptually:

    cover   → coverPreset
    profile → profilePreset

The registry exposes:

    getAssetPreset(type)
    getAssetPresets()

`getAssetPreset()` should be used when resolving the configuration for a specific asset type.

### 4.5 Asset Resolution

Asset requests are resolved before being passed to the core generator.

The resolver is responsible for combining the request with the appropriate asset preset and producing the configuration required for generation.

The resolution flow is:

    AssetRequest
        ↓
    resolveAssetRequest()
        ↓
    AssetPreset
        ↓
    PatternConfig
        ↓
    core generator

### 4.6 Pattern Selection

An `AssetPreset` contains exactly one resolved `PatternId`.

The preset does not contain an array of patterns.

For example, this is valid:

    pattern: "waves"

This is intentionally not part of the `AssetPreset` design:

    pattern: ["waves", "geometric", "blobs"]

When an asset needs controlled variation between multiple patterns, the selection should happen during asset resolution/generation and resolve to a single `PatternId`.

For example, covers may select between:

    waves
    geometric
    blobs

using the engine's seeded random system.

The resulting configuration still contains exactly one pattern:

    pattern: "geometric"

### 4.7 Asset Generation

The main asset generation entry point is:

    generateAsset(request)

The asset generator coordinates the complete asset-generation process and returns a `GeneratedImage`.

The generated image contains:

    {
      svg: string;
      width: number;
      height: number;
    }

### 4.8 BuildKiwi Integration

BuildKiwi stores the seed for generated assets rather than storing the generated SVG.

For project covers:

    MongoDB
       ↓
    coverSeed
       ↓
    GeneratedCover
       ↓
    generateAsset({
      type: "cover",
      seed: coverSeed,
    })
       ↓
    deterministic SVG

This allows the frontend to regenerate the same cover whenever the project is displayed or edited.

The frontend should not need to know which pattern, composition, or visual configuration was selected internally.

### 4.9 Asset System Rules

- Every asset type should have a clear preset.
- `AssetPreset.pattern` represents one resolved `PatternId`.
- Asset-level pattern selection belongs inside the pattern engine, not the frontend.
- Asset generation must use seeded randomness.
- Do not use `Math.random()` for asset generation.
- Do not store generated SVGs as the source of truth.
- The seed is the source of truth for deterministic generated assets.
- Keep asset-specific logic separate from individual pattern implementations.

## 5. Pattern System

The pattern system is responsible for generating the actual visual geometry used by the pattern engine.

A pattern receives a resolved `PatternConfig` through the core generation pipeline and produces a `PatternOutput` containing SVG-compatible visual elements.

The pattern system is intentionally independent from BuildKiwi's frontend.

### 5.1 Pattern Identity

Patterns are identified by `PatternId`.

Current supported pattern IDs:

    blobs
    waves
    constellation
    halftone
    geometric

`PatternId` is a union type defined in:

    src/core/types.ts

### 5.2 Pattern Generator

Every pattern implements the `PatternGenerator` interface:

    type PatternGenerator = {
      id: PatternId;
      generate(context: PatternContext): PatternOutput;
    };

A pattern generator has two responsibilities:

1. Identify itself using a `PatternId`.
2. Generate its visual output from the provided `PatternContext`.

A pattern should not know which asset type requested it.

For example, the `waves` pattern should only care about generating waves. It should not contain logic such as:

    if asset.type === "cover"

Asset-specific decisions belong to the asset/generation layer.

### 5.3 Pattern Context

Patterns receive a `PatternContext`:

    type PatternContext = {
      width: number;
      height: number;

      palette: readonly string[];

      random: SeededRandom;

      composition?: Composition;
      visualStyle?: VisualStyleId;
      visualBudget?: VisualBudget;
      colorSystem?: ColorSystem;
    };

The context provides the information a pattern needs to generate its visual output.

Important context values include:

- `width` and `height` — dimensions of the generated asset.
- `palette` — colors available to the pattern.
- `random` — deterministic seeded randomness.
- `composition` — optional spatial composition.
- `visualStyle` — optional visual style.
- `visualBudget` — optional limits on visual complexity.
- `colorSystem` — optional color configuration.

### 5.4 Pattern Output

Patterns return `PatternOutput`:

    type PatternOutput = {
      definitions?: PatternDefinition[];
      elements: PatternElement[];
    };

`elements` contains the visual geometry generated by the pattern.

Supported pattern elements currently include:

    Circle
    Rectangle
    Polygon
    Line
    Path

Patterns may also provide SVG definitions such as:

    LinearGradient
    RadialGradient

### 5.5 Pattern Registry

Patterns are registered through the core pattern registry.

The public API exposes:

    getPattern()
    getPatterns()
    getDefaultPattern()

The registry maps a `PatternId` to its corresponding `PatternGenerator`.

Conceptually:

    "waves"         → waves generator
    "geometric"     → geometric generator
    "blobs"         → blobs generator
    "constellation" → constellation generator
    "halftone"      → halftone generator

### 5.6 Pattern Generation Flow

The pattern-generation flow is:

    PatternConfig
        ↓
    core/generator.ts
        ↓
    resolve pattern
        ↓
    PatternGenerator
        ↓
    generate(context)
        ↓
    PatternOutput
        ↓
    SVG generation
        ↓
    GeneratedImage

### 5.7 Deterministic Pattern Generation

Patterns must use the `SeededRandom` instance provided through `PatternContext`.

Use:

    random.next()
    random.int(...)
    random.pick(...)

Do not use:

    Math.random()

Any visual property that depends on randomness should therefore be reproducible from the asset seed.

Examples include:

- Pattern selection.
- Number of elements.
- Element positions.
- Sizes.
- Rotation.
- Opacity.
- Shape variation.
- Color selection.

The same seed and configuration should produce the same pattern output.

### 5.8 Pattern Selection vs Pattern Generation

Pattern selection and pattern generation are separate responsibilities.

Pattern selection determines:

    which PatternId should be used?

Pattern generation determines:

    how should that PatternId be rendered?

For example, a cover may deterministically select:

    waves

or:

    geometric

or:

    blobs

Once selected, the configuration contains one resolved `PatternId`, and the corresponding generator is responsible for rendering it.

A pattern generator should never randomly switch between unrelated patterns itself.

### 5.9 Pattern Independence

Patterns should be independently understandable and testable.

A pattern should ideally be able to answer:

    Given this PatternContext, what visual elements should I generate?

It should not depend on:

- React.
- BuildKiwi frontend components.
- MongoDB.
- HTTP requests.
- Routing.
- Application state.
- Browser APIs.
- BuildKiwi-specific business logic.

### 5.10 Pattern Complexity

Patterns should remain visually interesting without becoming unnecessarily complex.

Prefer:

- Simple geometric primitives.
- Reusable layout utilities.
- Seeded variation.
- Controlled visual density.
- Clear composition.

Avoid large amounts of special-case logic when a simpler mathematical or compositional approach is sufficient.

Individual pattern implementations should remain reasonably small and maintainable.

### 5.11 Adding a New Pattern

A new pattern should generally require:

1. Define or confirm a `PatternId`.
2. Create the pattern generator.
3. Implement the `PatternGenerator` interface.
4. Register the generator in the pattern registry.
5. Use existing `PatternContext`, layout, composition, theme, and random utilities where appropriate.
6. Verify deterministic output using the same seed.

A new pattern should not require changes to the BuildKiwi frontend unless the public asset API itself needs to change.

### 5.12 Current Pattern Direction

The initial focus for project covers is:

    waves
    geometric
    blobs

Other patterns such as:

    constellation
    halftone

remain available in the pattern system but are not currently part of the initial cover variation set.

The set of patterns used by a particular asset type should be controlled by the asset-generation layer rather than hard-coded into individual pattern generators.

## 6. Deterministic Randomness

Deterministic randomness is a core requirement of the pattern engine.

The engine should produce visual variation that appears random while remaining completely reproducible from the input seed.

The fundamental rule is:

    same seed + same configuration → same output

### 6.1 Seeded Random System

The engine defines:

    PatternRandom
    SeededRandom

The random system provides:

    next()
    int(min, max)
    pick(items)

Patterns receive the seeded random instance through `PatternContext`:

    type PatternContext = {
      ...
      random: SeededRandom;
      ...
    };

### 6.2 Never Use `Math.random()`

`Math.random()` must not be used for generated asset behavior.

Do not write:

    Math.random()

inside asset generation, pattern generation, composition generation, or any other system that affects the generated SVG.

`Math.random()` is not tied to the asset seed and would make output change between renders.

### 6.3 Use the Provided Seeded Random Instance

All generated variation should use:

    context.random

or the equivalent seeded random instance passed through the generation pipeline.

Examples:

    random.next()

    random.int(0, 100)

    random.pick(["waves", "geometric", "blobs"])

This ensures that random decisions are derived from the asset seed.

### 6.4 Random Pattern Selection

When an asset supports multiple patterns, pattern selection should also be deterministic.

For example, covers may choose from:

    const coverPatterns = [
      "waves",
      "geometric",
      "blobs",
    ] as const;

The selection should use:

    random.pick(coverPatterns)

The result is one `PatternId`.

For example:

    seed A → waves
    seed B → geometric
    seed C → blobs

The same seed must always produce the same selection.

### 6.5 Randomness Must Be Part of the Generation Pipeline

Random decisions should happen during asset generation using the seeded random instance.

They should not happen at module initialization.

Incorrect:

    const pattern =
      coverPatterns[
        Math.floor(Math.random() * coverPatterns.length)
      ];

    export const coverPreset = {
      ...
      pattern,
    };

This runs when the module is imported and produces a single global choice that is shared by every generated asset.

It is also unrelated to the asset seed.

Correct:

    generateAsset(request)
        ↓
    create seeded random
        ↓
    make deterministic choices
        ↓
    generate pattern
        ↓
    SVG

### 6.6 Randomness Should Be Reproducible

Randomness is not used to make the output truly unpredictable.

It is used to make deterministic output appear varied.

For example:

    seed: "abc123"
        → geometric

    seed: "abc123"
        → geometric

    seed: "abc123"
        → geometric

while a different seed may produce:

    seed: "xyz789"
        → waves

### 6.7 Random Decisions Should Affect Visual Details

Seeded randomness may control:

- Pattern selection.
- Number of elements.
- Element positions.
- Element sizes.
- Rotation.
- Opacity.
- Shape variation.
- Color selection.
- Spacing.
- Composition variation.

All such decisions must remain reproducible from the seed.

### 6.8 Randomness and BuildKiwi Persistence

BuildKiwi stores the seed for generated assets.

For example:

    project.coverSeed
          ↓
    generateAsset({
      type: "cover",
      seed: project.coverSeed,
    })

The generated SVG is not the source of truth.

The seed is.

Therefore, deterministic randomness is required for:

- Project pages.
- Project editing.
- Reloading the application.
- Re-rendering React components.
- Regenerating assets.
- Future clients consuming the same asset system.

### 6.9 Changing the Algorithm

The seed guarantees deterministic output for a given version of the generation algorithm.

It does not guarantee that an asset will remain visually identical forever if the generation algorithm itself changes.

For example:

    Version 1
    seed "abc123" → waves

    Version 2
    seed "abc123" → geometric

This is acceptable when intentionally changing the generation system.

However, changes to the generation algorithm should be made carefully because existing BuildKiwi projects depend on their stored seeds.

### 6.10 Rule of Thumb

Whenever code needs randomness, ask:

    "Can this decision be derived from the asset seed?"

If yes, use the engine's seeded random system.

If not, the design should be reconsidered before introducing non-deterministic randomness.

The engine should never sacrifice reproducibility simply to make an asset appear more random.

## 7. Cover Generation

Project covers are generated by the pattern engine as deterministic SVG assets.

A BuildKiwi project stores a `coverSeed` rather than storing the generated SVG.

The cover is recreated whenever the project is rendered using the same seed.

### 7.1 Cover Request

The BuildKiwi frontend requests a cover through the public asset API:

    generateAsset({
      type: "cover",
      seed,
    });

The frontend does not need to know which pattern or visual configuration will be selected.

### 7.2 Cover Dimensions

The default cover preset uses:

    width: 1200
    height: 630

The cover preset is defined in:

    src/presets/cover.ts

### 7.3 Cover Preset

The current cover preset is:

    export const coverPreset: AssetPreset = {
      type: "cover",
      width: 1200,
      height: 630,
      pattern: "waves",
    };

The `pattern` property represents one `PatternId`.

It must not be changed to an array simply because covers support multiple possible patterns.

For example, this is not valid:

    pattern: ["waves", "geometric", "blobs"]

### 7.4 Cover Pattern Selection

The initial cover system supports deterministic selection between:

    waves
    geometric
    blobs

The selection should happen during asset generation using the engine's seeded random system.

Conceptually:

    coverSeed
        ↓
    seeded random
        ↓
    random.pick([
      "waves",
      "geometric",
      "blobs",
    ])
        ↓
    resolved PatternId
        ↓
    pattern generator

The selected pattern must be a single `PatternId` before the core pattern generator is called.

### 7.5 Deterministic Cover Behavior

The same `coverSeed` must always produce the same cover.

This includes:

- Pattern selection.
- Pattern geometry.
- Element positions.
- Element sizes.
- Colors.
- Composition.
- Other generated visual properties.

For example:

    coverSeed = "abc123"

must consistently produce the same pattern and visual output whenever it is rendered.

### 7.6 Frontend Integration

The BuildKiwi frontend uses a small wrapper component for generated covers.

Example:

    const image = generateAsset({
      type: "cover",
      seed,
    });

The frontend should not contain:

- Pattern selection logic.
- `Math.random()`.
- Pattern-specific generation logic.
- SVG construction logic.

The frontend only provides the asset type and seed and renders the returned SVG.

### 7.7 Cover Persistence

The database should store:

    coverSeed

rather than:

    generated SVG

The flow is:

    Project
       ↓
    coverSeed
       ↓
    GeneratedCover
       ↓
    generateAsset()
       ↓
    deterministic SVG

This keeps the database small and makes the visual asset reproducible.

### 7.8 Cover Editing

When a project is edited, the existing `coverSeed` should continue to be used unless the user explicitly requests a new cover.

Editing a project must not accidentally generate a new random cover.

The same stored seed should reproduce the same cover before and after editing.

### 7.9 New Cover Generation

When a new project needs a new cover, a new seed may be generated.

The new seed becomes the project's `coverSeed`.

After the seed is persisted, every future render should use that same seed.

### 7.10 Cover Pattern Scope

The initial cover pattern set is intentionally limited to:

    waves
    geometric
    blobs

Other registered patterns may exist in the pattern engine but should not automatically become cover patterns.

Adding a new pattern to the global pattern registry does not automatically mean it should be used for covers.

Cover-specific pattern selection should remain controlled by the asset-generation layer.

### 7.11 Cover Generation Rules

- Covers must be deterministic.
- Covers must use the stored `coverSeed`.
- Cover pattern selection must use seeded randomness.
- Never use `Math.random()` for cover generation.
- Never select a cover pattern at module import time.
- `AssetPreset.pattern` remains a single `PatternId`.
- Pattern selection belongs inside the pattern engine.
- The frontend should only request and render the generated asset.
- Existing project seeds should remain stable unless a new cover is intentionally generated.

## 8. BuildKiwi Integration

`@buildkiwi/pattern-engine` is a standalone package within the BuildKiwi monorepo.

BuildKiwi uses the package to generate visual assets such as project covers and profile graphics.

The integration is intentionally kept small: BuildKiwi provides an asset type and seed, while the pattern engine owns the visual-generation process.

### 8.1 Package Location

The package lives at:

    C:\buildkiwi\packages\pattern-engine

It is consumed by the BuildKiwi web application through the workspace package:

    @buildkiwi/pattern-engine

### 8.2 Frontend Contract

The BuildKiwi frontend should interact with the engine through the public API.

For generated covers:

    import { generateAsset } from "@buildkiwi/pattern-engine";

    const image = generateAsset({
      type: "cover",
      seed,
    });

The frontend receives a `GeneratedImage` containing:

    {
      svg: string;
      width: number;
      height: number;
    }

The frontend is responsible only for rendering the returned SVG.

### 8.3 Generated Cover Component

BuildKiwi currently wraps cover generation in a React component:

    apps/web/src/components/projects/GeneratedCover.tsx

The component receives:

    seed: string
    className?: string

It calls:

    generateAsset({
      type: "cover",
      seed,
    });

The component should remain intentionally thin.

Pattern selection, randomness, composition, themes, and SVG generation belong to the pattern engine.

### 8.4 Database Integration

BuildKiwi stores the seed used to generate a project's cover.

The project model uses:

    coverSeed

The generated SVG is not stored as the source of truth.

The database flow is:

    Project
       ↓
    coverSeed
       ↓
    Pattern Engine
       ↓
    Generated SVG

### 8.5 Create Project Flow

When a new project is created:

    new project
        ↓
    generate or assign coverSeed
        ↓
    persist project
        ↓
    render cover using coverSeed

The seed becomes part of the project's persistent identity.

Once stored, the same seed should be reused for future renders.

### 8.6 Project Page Flow

When a project is opened:

    project
       ↓
    project.coverSeed
       ↓
    GeneratedCover
       ↓
    generateAsset({
      type: "cover",
      seed: project.coverSeed,
    })
       ↓
    SVG

The project page should not generate a new seed.

### 8.7 Edit Project Flow

Editing a project must preserve the existing cover seed unless the user intentionally requests a new cover.

The following behavior is incorrect:

    open edit page
        ↓
    generate new seed
        ↓
    cover changes unexpectedly

The desired behavior is:

    existing coverSeed
        ↓
    same generated cover

This is particularly important because the pattern engine is deterministic.

### 8.8 Source of Truth

BuildKiwi owns the persistence of the seed.

Pattern Engine owns the interpretation of the seed.

Therefore:

    BuildKiwi
      → stores coverSeed

    Pattern Engine
      → converts coverSeed into deterministic visual output

Neither side should take over the other's responsibility.

### 8.9 No Application-Specific Logic in Pattern Engine

The pattern engine should not know about:

- MongoDB.
- Projects.
- Users.
- Authentication.
- React.
- React Router.
- BuildKiwi API routes.
- BuildKiwi UI components.
- Application-specific database models.

The engine should operate entirely on its own types such as:

    AssetRequest
    AssetPreset
    PatternConfig
    PatternContext

### 8.10 No Pattern Logic in BuildKiwi UI

BuildKiwi UI components should not contain:

    if pattern === "waves"
    if pattern === "blobs"
    Math.random()
    SVG generation
    pattern geometry
    seeded-random implementation

If the visual-generation behavior changes, the preferred place to make the change is inside:

    @buildkiwi/pattern-engine

rather than inside individual React components.

### 8.11 Integration Principle

The ideal BuildKiwi integration remains:

    BuildKiwi
        │
        │ type + seed
        ↓
    Pattern Engine
        │
        │ generated SVG
        ↓
    BuildKiwi

BuildKiwi should not need to understand how the SVG was created.

This allows the pattern engine to evolve independently while keeping the BuildKiwi frontend simple.

## 9. Project Structure

The pattern engine is organized into focused modules. Each directory has a specific responsibility.

Current structure:

    packages/pattern-engine/
    ├── src/
    │   ├── assets/
    │   │   ├── generator.ts
    │   │   ├── index.ts
    │   │   ├── registry.ts
    │   │   └── resolver.ts
    │   │
    │   ├── core/
    │   │   ├── generator.ts
    │   │   ├── registry.ts
    │   │   └── types.ts
    │   │
    │   ├── presets/
    │   │   ├── cover.ts
    │   │   └── profile.ts
    │   │
    │   ├── patterns/
    │   │   ├── blobs/
    │   │   ├── geometric/
    │   │   ├── waves/
    │   │   ├── constellation/
    │   │   └── halftone/
    │   │
    │   ├── composition/
    │   │
    │   ├── layout/
    │   │
    │   ├── motifs/
    │   │
    │   ├── themes/
    │   │
    │   └── index.ts
    │
    └── package.json

### 9.1 `src/index.ts`

The public entry point of `@buildkiwi/pattern-engine`.

It exports the stable public API and public types.

Examples:

    generateAsset
    getAssetPreset
    resolveAssetRequest
    generatePattern
    getPattern
    getPatterns
    getDefaultPattern

It also exports public types such as:

    AssetPreset
    AssetRequest
    AssetType
    PatternId
    PatternConfig
    PatternContext
    PatternGenerator
    PatternOutput

Internal implementation details should not be exported unless they are intentionally part of the package API.

### 9.2 `src/assets/`

Responsible for complete asset generation.

Files:

    generator.ts
    registry.ts
    resolver.ts
    index.ts

Responsibilities:

- Accept asset requests.
- Resolve asset presets.
- Select asset-level configuration.
- Coordinate the generation pipeline.
- Return generated images.

#### `assets/generator.ts`

Coordinates the complete asset-generation process.

This is the primary place for asset-level decisions such as deterministic cover pattern selection.

#### `assets/registry.ts`

Registers asset presets.

Current mappings:

    cover   → coverPreset
    profile → profilePreset

#### `assets/resolver.ts`

Resolves an `AssetRequest` into the configuration needed by the generation pipeline.

#### `assets/index.ts`

Re-exports the asset-layer public functions.

### 9.3 `src/core/`

Contains the central pattern-generation infrastructure.

Files:

    generator.ts
    registry.ts
    types.ts

#### `core/types.ts`

Contains the primary type definitions for the engine.

Important types include:

    AssetType
    AssetRequest
    AssetPreset
    PatternId
    PatternConfig
    PatternContext
    PatternOutput
    PatternGenerator
    PatternRandom
    SeededRandom

This file defines important architectural contracts and should not be changed casually.

#### `core/generator.ts`

Coordinates pattern generation from a resolved `PatternConfig`.

It connects the configuration, seeded randomness, pattern registry, composition, themes, and pattern generators.

#### `core/registry.ts`

Registers and resolves pattern generators.

It provides:

    getPattern()
    getPatterns()
    getDefaultPattern()

### 9.4 `src/presets/`

Contains asset-specific default configurations.

Current presets:

    cover.ts
    profile.ts

Presets describe default dimensions and visual configuration for each asset type.

A preset's `pattern` property is a single `PatternId`.

### 9.5 `src/patterns/`

Contains the actual visual pattern generators.

Current patterns:

    blobs/
    geometric/
    waves/
    constellation/
    halftone/

Each pattern is responsible for generating its own visual elements through the `PatternGenerator` interface.

Pattern implementations should remain independent of BuildKiwi application logic.

### 9.6 `src/composition/`

Contains reusable composition logic.

Composition controls how visual content is positioned and balanced within an asset.

Current composition concepts include:

    center
    corner
    diagonal
    radial
    asymmetric
    cluster
    framed
    modular

Composition generators receive a `CompositionContext` and return a `Composition`.

### 9.7 `src/layout/`

Contains reusable geometric and positioning utilities.

Examples include:

    createBounds
    insetBounds
    clampPoint
    distributeSpacing
    createGrid
    createRadialPositions
    distributeRandomly
    createSafeArea
    createCluster
    samplePoint
    samplePoints

Layout utilities should remain generic and reusable across patterns and compositions.

### 9.8 `src/motifs/`

Contains reusable visual motifs that can be used by pattern generators.

Motifs should provide reusable visual building blocks rather than becoming asset-specific logic.

### 9.9 `src/themes/`

Contains visual theme and color-system logic.

The theme system is responsible for resolving visual styles and color systems used during generation.

The public API includes:

    resolvePatternTheme()

Themes should remain independent from individual pattern implementations where possible.

### 9.10 Module Dependency Direction

The preferred dependency direction is:

    BuildKiwi UI
        ↓
    assets
        ↓
    core
        ↓
    patterns / composition / themes / layout / motifs

Lower-level systems should not depend on BuildKiwi UI or application-specific code.

Patterns may use shared lower-level systems, but the reverse should not occur.

### 9.11 Where Should a Change Go?

Use the following rule of thumb:

    "Which layer owns this decision?"

Asset behavior:
src/assets/

Asset defaults:
src/presets/

Pattern behavior:
src/patterns/

Pattern registration:
src/core/registry.ts

Core generation:
src/core/generator.ts

Type contracts:
src/core/types.ts

Spatial positioning:
src/layout/

Composition:
src/composition/

Reusable visual motifs:
src/motifs/

Colors and visual themes:
src/themes/

Public API:
src/index.ts

Avoid modifying multiple layers when a change can be cleanly contained within the layer that owns the behavior.

## 11. Important Decisions

This section records architectural decisions that have been intentionally made for the pattern engine.

Future changes should preserve these decisions unless there is a deliberate reason to revisit them.

### 11.1 Seeds Are the Source of Truth

BuildKiwi stores a seed for generated assets rather than storing the generated SVG.

For project covers, the persistent value is:

    coverSeed

The seed is passed back into the pattern engine whenever the asset is rendered.

Therefore:

    seed → generated asset

is the source of truth.

### 11.2 Generated SVG Is Not Persisted

The generated SVG should not be stored in the BuildKiwi database as the primary representation of a generated asset.

SVG is derived from:

    seed + generation configuration

This keeps persistence small and allows assets to be regenerated.

### 11.3 Asset Presets Contain One Pattern

`AssetPreset.pattern` is intentionally:

    pattern: PatternId

It represents one resolved/default pattern.

Do not change it to:

    pattern: PatternId[]

just to support multiple possible patterns.

If an asset supports multiple patterns, the generation layer selects one pattern deterministically and resolves it to a single `PatternId`.

### 11.4 Pattern Selection Belongs to the Generation Layer

The asset/generation layer decides which pattern an asset should use.

Pattern generators decide how a selected pattern is rendered.

For example:

    Asset generation
        ↓
    choose "waves"
        ↓
    waves generator
        ↓
    visual output

A pattern generator should not be responsible for selecting between unrelated patterns.

### 11.5 No `Math.random()`

`Math.random()` is not used for generated asset behavior.

All randomness affecting generated output must come from the engine's seeded random system.

This includes:

- Pattern selection.
- Geometry.
- Position.
- Size.
- Color selection.
- Composition.
- Visual variation.

### 11.6 Never Randomize a Preset at Module Load

Do not do this:

    const pattern =
      coverPatterns[
        Math.floor(Math.random() * coverPatterns.length)
      ];

    export const coverPreset = {
      ...
      pattern,
    };

A preset is configuration, not a runtime random generator.

Random decisions must happen during asset generation using the current asset's seed.

### 11.7 Cover Pattern Set Is Explicit

The initial cover pattern set is:

    waves
    geometric
    blobs

Other patterns may exist in the engine, but registering a pattern globally does not automatically make it available for covers.

Cover pattern selection should remain explicit.

### 11.8 Frontend Does Not Choose Patterns

BuildKiwi's React components should request an asset:

    generateAsset({
      type: "cover",
      seed,
    });

They should not contain logic such as:

    pattern = ...
    Math.random()
    if pattern === "waves"
    if pattern === "blobs"

Pattern selection belongs inside `@buildkiwi/pattern-engine`.

### 11.9 GeneratedCover Should Remain Thin

The BuildKiwi `GeneratedCover` component is intentionally a thin rendering wrapper.

Its responsibility is:

    receive seed
        ↓
    call generateAsset()
        ↓
    render SVG

It should not become a second pattern-generation system.

### 11.10 Pattern Engine Is Frontend-Agnostic

The pattern engine must not depend on:

- React.
- React Router.
- BuildKiwi UI components.
- MongoDB.
- HTTP APIs.
- Authentication.
- Application state.

It is an independent TypeScript package.

### 11.11 Existing Types Represent Architectural Boundaries

Types such as:

    AssetPreset
    AssetRequest
    PatternConfig
    PatternContext
    PatternGenerator
    PatternId

are not merely implementation details.

They represent boundaries between different parts of the engine.

Do not broaden or restructure them simply to make a local implementation easier.

### 11.12 Prefer Small Implementations

Pattern implementations should remain relatively small and understandable.

Do not introduce large frameworks, complex abstractions, or excessive configuration for simple visual effects.

If a pattern can be implemented with a few straightforward geometric operations, prefer that approach.

### 11.13 Reuse Existing Engine Systems

Before adding new infrastructure, check whether the existing systems can solve the problem.

Existing reusable systems include:

    seeded randomness
    composition
    layout
    themes
    motifs
    SVG primitives

New abstractions should solve a real recurring problem rather than being introduced speculatively.

### 11.14 Same Seed Means Same Visual Identity

A project's `coverSeed` is part of its visual identity.

Changing the seed intentionally creates a new cover.

Rendering the same seed should not unexpectedly create a different cover.

### 11.15 Generation Algorithm Changes Are Significant

Changing the generation algorithm may change the visual output for existing seeds.

This is allowed, but it should be treated as an intentional change to the visual-generation system.

Avoid casually changing deterministic algorithms if visual stability for existing projects matters.

### 11.16 Public API Is the Package Boundary

Consumers should use:

    @buildkiwi/pattern-engine

rather than importing internal files directly.

Internal architecture can evolve without requiring changes in BuildKiwi as long as the public API remains stable.

### 11.17 Current Direction

The current priority is to make the pattern engine a reliable deterministic visual-generation system before expanding its complexity.

The preferred direction is:

    simple
    deterministic
    composable
    reusable
    visually interesting
    easy to maintain

Complexity should be added only when it provides clear visual or architectural value.

## 12. Things Not To Do

The following practices should be avoided unless an architectural decision is intentionally changed.

### 12.1 Do Not Use `Math.random()`

Never use:

    Math.random()

for any value that affects generated assets.

This breaks deterministic generation.

Use the seeded random instance instead:

    random.next()
    random.int(...)
    random.pick(...)

### 12.2 Do Not Randomize at Module Load

Do not make random decisions while defining presets or importing modules.

Avoid:

    const pattern = randomChoice(...);

    export const coverPreset = {
      ...
      pattern,
    };

This creates a global/static decision instead of a seed-specific decision.

Random choices must happen inside the generation pipeline.

### 12.3 Do Not Store Generated SVG as the Source of Truth

Do not make the generated SVG the persistent representation of a project cover.

BuildKiwi should store:

    coverSeed

and regenerate the SVG from that seed.

### 12.4 Do Not Generate a New Seed During Rendering

Rendering a project should never create a new seed.

Do not do:

    render
      ↓
    generate new seed
      ↓
    generate cover

A render must use the existing stored seed.

### 12.5 Do Not Change the Cover When Editing a Project

Opening or saving the project edit page should not automatically generate a new cover.

Use the existing:

    project.coverSeed

unless the user explicitly chooses to generate a new cover.

### 12.6 Do Not Put Pattern Selection in React Components

Do not make BuildKiwi components decide:

    waves vs geometric vs blobs

The frontend should only provide:

    type
    seed

The pattern engine owns the selection.

### 12.7 Do Not Put BuildKiwi Logic Inside Patterns

Pattern generators should not know about:

- Projects.
- Users.
- Authentication.
- MongoDB.
- API requests.
- React.
- Routes.
- BuildKiwi-specific business rules.

Patterns should generate visual output from their provided context.

### 12.8 Do Not Change `PatternId` to Solve Pattern Selection

Do not turn:

    pattern: PatternId

into a collection simply because multiple patterns are available.

For example, avoid:

    pattern: PatternId[]

The correct architecture is:

    multiple candidates
        ↓
    deterministic selection
        ↓
    one PatternId
        ↓
    pattern generator

### 12.9 Do Not Make Every Registered Pattern a Cover Pattern

Adding a pattern to the global pattern registry does not automatically mean it should be used for covers.

The cover pattern set is intentionally controlled.

Current initial set:

    waves
    geometric
    blobs

### 12.10 Do Not Duplicate Pattern Logic

Do not implement the same visual behavior separately in:

    BuildKiwi frontend
    pattern engine
    individual patterns

There should be one authoritative implementation for generated visual behavior.

### 12.11 Do Not Bypass the Public API

Avoid imports such as:

    @buildkiwi/pattern-engine/src/...

Consumers should normally use:

    @buildkiwi/pattern-engine

Internal modules may change as the engine evolves.

### 12.12 Do Not Add Abstractions Without a Real Need

Avoid introducing:

- Generic factories.
- Large configuration systems.
- Unnecessary interfaces.
- Complex dependency injection.
- Overly generic helper layers.
- Multiple layers for simple operations.

If a straightforward function solves the problem, prefer the straightforward function.

### 12.13 Do Not Over-Engineer Visual Effects

A pattern does not need a complex mathematical system to look good.

Prefer simple combinations of:

    lines
    circles
    polygons
    paths
    controlled randomness
    composition

Visual complexity should come from composition and variation rather than unnecessary code complexity.

### 12.14 Do Not Let Pattern Files Become Huge

Keep individual pattern implementations reasonably small.

If a pattern becomes difficult to understand, look for reusable:

    layout
    composition
    motif
    theme
    geometry

utilities before continuing to grow the pattern file.

### 12.15 Do Not Mix Responsibilities

Avoid code where one layer starts doing another layer's job.

For example:

    Pattern
      → asset selection
      → database access
      → theme resolution
      → frontend rendering

Instead:

    Asset layer
      → asset decisions

    Core
      → generation coordination

    Pattern
      → visual generation

    Layout
      → spatial utilities

    Theme
      → visual/color configuration

### 12.16 Do Not Break Determinism for Convenience

If a quick implementation uses non-seeded randomness, global state, timestamps, browser APIs, or other unstable inputs, do not use it merely because it is easier.

Generated assets must remain reproducible.

### 12.17 Do Not Modify Existing Architecture Without Checking the Context

Before changing an existing type, registry, generator, or public API, check:

- Why it exists.
- Which layer owns the responsibility.
- Whether BuildKiwi depends on it.
- Whether determinism is affected.
- Whether the change introduces unnecessary complexity.

A local problem should not automatically result in a global architectural change.

### 12.18 Do Not Add Features Before the Core System Is Stable

The priority is:

    deterministic generation
        ↓
    reliable patterns
        ↓
    clean asset integration
        ↓
    visual refinement
        ↓
    additional features

New features should not make the core generation pipeline harder to understand or maintain.

## 13. Current Status

The pattern engine is currently in active development.

The core architecture is established, deterministic asset generation is in place, and the engine is being expanded toward a more varied and reusable visual-generation system.

### 13.1 Package Status

Package:

    @buildkiwi/pattern-engine

Location:

    C:\buildkiwi\packages\pattern-engine

Language:

    TypeScript

The package is part of the BuildKiwi monorepo and is consumed by the web application as a workspace package.

### 13.2 Asset System

Currently supported asset types:

    cover
    profile

Asset generation follows:

    AssetRequest
        ↓
    Asset resolution
        ↓
    Asset preset
        ↓
    Pattern configuration
        ↓
    Pattern generation
        ↓
    SVG

The asset system is already structured around presets, registries, and resolution.

### 13.3 Deterministic Generation

Seeded randomness is established as a core requirement.

The engine uses:

    SeededRandom

with:

    next()
    int()
    pick()

Generated visual properties should be derived from the provided seed.

`Math.random()` is not part of the intended generation system.

### 13.4 Current Patterns

The pattern registry currently contains:

    waves
    geometric
    blobs
    constellation
    halftone

The initial project-cover variation set is intentionally smaller:

    waves
    geometric
    blobs

The other patterns remain available for future use.

### 13.5 Cover Generation

Project covers use:

    1200 × 630

The current cover preset has:

    pattern: "waves"

This pattern value acts as the preset/default configuration.

The intended cover-generation behavior is to deterministically select between:

    waves
    geometric
    blobs

using the asset seed during the generation pipeline.

### 13.6 BuildKiwi Integration

BuildKiwi stores:

    coverSeed

The generated SVG is produced at render time.

Current frontend integration:

    apps/web/src/components/projects/GeneratedCover.tsx

The component calls:

    generateAsset({
      type: "cover",
      seed,
    });

The frontend does not contain pattern-generation logic.

### 13.7 Existing Visual Systems

The engine already contains architectural support for:

    composition
    layout
    themes
    motifs
    seeded randomness

These systems are intended to be reused by patterns rather than duplicating the same logic inside every pattern.

### 13.8 Type System

The core type system currently represents:

    AssetType
    AssetRequest
    AssetPreset

    PatternId
    PatternConfig
    PatternContext
    PatternGenerator
    PatternOutput

    Composition
    CompositionContext
    CompositionGenerator

    VisualStyleId
    ColorSystem
    VisualBudget

    PatternElement
    PatternDefinition

The existing types should be treated as intentional architectural boundaries.

### 13.9 Current Development Focus

The current focus is improving cover generation.

Immediate goal:

    one seed
        ↓
    deterministic cover pattern selection
        ↓
    deterministic pattern generation
        ↓
    deterministic SVG

The first cover pattern set is:

    waves
    geometric
    blobs

The implementation should remain simple and avoid introducing unnecessary abstractions.

### 13.10 Known Architectural Constraint

Pattern selection must happen using the seeded random system during generation.

It must not happen through:

    Math.random()

or:

    module-level random selection

The existing:

    AssetPreset.pattern: PatternId

should remain a single `PatternId`.

Multiple candidate patterns should resolve to one pattern before pattern generation.

### 13.11 BuildKiwi Persistence Status

The BuildKiwi project model uses:

    coverSeed

The intended behavior is:

    create project
        ↓
    generate/store coverSeed
        ↓
    render cover from coverSeed

and:

    edit project
        ↓
    preserve coverSeed
        ↓
    render same cover

A new cover should only be generated when intentionally requested.

### 13.12 Stability Goal

Before adding significant new visual systems, the following should remain reliable:

- Deterministic generation.
- Stable asset requests.
- Correct pattern resolution.
- Correct seeded randomness.
- Stable BuildKiwi integration.
- Reproducible project covers.
- Simple public API.

### 13.13 Current Maturity

The engine should currently be treated as:

    functional foundation
        +
    active visual development

The architecture is established, but the visual system is still evolving.

Future work should prioritize improving visual quality and reuse without sacrificing:

    simplicity
    determinism
    maintainability
    frontend independence

## 14. Roadmap

The pattern engine should evolve gradually.

The priority is to first make the existing generation pipeline reliable and visually strong, then expand the system with additional patterns and reusable visual systems.

The roadmap should not be treated as a rigid implementation schedule.

### 14.1 Phase 1 — Stabilize Deterministic Generation

Focus on making the existing generation pipeline reliable.

Goals:

- Ensure the same seed always produces the same output.
- Ensure seeded randomness is used consistently.
- Remove any accidental use of `Math.random()`.
- Verify asset resolution.
- Verify pattern resolution.
- Verify SVG generation.
- Keep the public API stable.

Target flow:

    seed
      ↓
    deterministic asset resolution
      ↓
    deterministic pattern selection
      ↓
    deterministic pattern generation
      ↓
    SVG

### 14.2 Phase 2 — Multi-Pattern Covers

Implement deterministic cover pattern selection.

Initial cover patterns:

    waves
    geometric
    blobs

Selection should be based on the cover seed.

Example:

    seed A → waves
    seed B → geometric
    seed C → blobs

The important requirement is:

    same seed → same selected pattern

No frontend changes should be required for this.

### 14.3 Phase 3 — Improve Existing Patterns

Improve the visual quality of the existing patterns without significantly increasing implementation complexity.

Focus on:

- Better composition.
- Better spacing.
- Better visual balance.
- More interesting seeded variation.
- Controlled density.
- Better use of color systems.
- Better use of the available visual budget.

Patterns should remain relatively small and understandable.

### 14.4 Phase 4 — Strengthen Shared Visual Systems

Improve reusable systems where patterns would benefit from them.

Potential areas:

    composition
    layout
    themes
    motifs

The goal is to allow multiple patterns to reuse the same visual infrastructure.

For example:

    pattern
       +
    composition
       +
    theme
       +
    layout

rather than duplicating the same logic inside each pattern.

### 14.5 Phase 5 — Expand Cover Variety

Once the initial cover system is stable, additional patterns can be considered.

Existing candidates include:

    constellation
    halftone

Future patterns should only be added when they provide meaningful visual variety.

Adding patterns simply to increase the number of patterns is not a goal.

### 14.6 Phase 6 — Improve Profile Assets

The profile asset system can be developed further after the cover system is stable.

Potential improvements include:

- More profile compositions.
- Better avatar/profile visual styles.
- More deterministic variation.
- Reusable motifs.
- Better theme integration.

Profile generation should continue using the same underlying deterministic architecture.

### 14.7 Phase 7 — Visual Style System

Expand the relationship between patterns and visual styles.

Existing style concepts include:

    minimal
    geometric
    organic
    editorial
    technical
    playful

Future versions may allow an asset to deterministically resolve a visual style and then generate a compatible combination of:

    pattern
    composition
    color system
    visual budget

The system should remain simple enough that style selection does not become a large configuration framework.

### 14.8 Phase 8 — Generation Versioning

If the engine becomes visually mature and existing projects need long-term visual stability, consider generation versioning.

For example:

    generationVersion: 1

could allow the engine to preserve the behavior of older assets while newer projects use a newer generation algorithm.

This should only be introduced when there is a real need.

Do not add versioning prematurely.

### 14.9 Phase 9 — Testing

Expand deterministic tests around the generation pipeline.

Important tests should verify:

- Same seed produces the same output.
- Different seeds can produce different outputs.
- Pattern selection is deterministic.
- Every registered pattern can generate valid output.
- Asset presets resolve correctly.
- SVG output is valid.
- BuildKiwi cover generation remains stable.

A useful principle is:

    deterministic input
        ↓
    deterministic expected output

### 14.10 Phase 10 — Performance

Once the visual system is stable, evaluate generation performance.

Potential areas:

- Avoid unnecessary calculations.
- Reduce redundant allocations.
- Keep SVG output reasonably sized.
- Avoid expensive geometry when simpler geometry works.
- Ensure repeated React renders do not introduce unnecessary work.

Performance improvements should not compromise determinism or code simplicity.

### 14.11 Phase 11 — Documentation

Keep the pattern-engine documentation aligned with the implementation.

Important documentation should cover:

- Public API.
- Asset types.
- Pattern system.
- Seeded randomness.
- Composition.
- Themes.
- Layout.
- Adding new patterns.
- BuildKiwi integration.
- Important architectural decisions.

This context file should be updated when major architectural decisions change.

### 14.12 Long-Term Direction

The long-term goal is for the pattern engine to become a reusable visual-generation system for BuildKiwi.

The desired architecture is:

    Seed
      ↓
    Asset
      ↓
    Pattern
      ↓
    Composition
      ↓
    Theme
      ↓
    Visual variation
      ↓
    SVG

The engine should be capable of producing a large amount of visual variety from a relatively small set of reusable systems.

The goal is not maximum complexity.

The goal is:

    small primitives
        +
    deterministic randomness
        +
    strong composition
        +
    reusable systems
        =
    rich visual variety

### 14.13 Roadmap Principle

Every new feature should be evaluated against the core principles of the engine:

- Is it deterministic?
- Is it reusable?
- Does it belong in the correct layer?
- Does it improve the visual system meaningfully?
- Does it keep the public API simple?
- Does it avoid unnecessary abstraction?
- Does it make the engine easier or harder to maintain?

If a feature adds significant complexity without meaningful visual or architectural value, it should probably not be added.
