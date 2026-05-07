#include <SwiftUI/SwiftUI.h>
#include <metal_stdlib>

using namespace metal;

static float hash21(float2 p) {
  float3 p3 = fract(float3(p.xyx) * float3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

[[stitchable]] half4 glide(float2 position, SwiftUI::Layer layer, float2 size,
                           float time, float baseAngle, texture2d<half> tex) {
  constexpr sampler s(address::clamp_to_zero, filter::linear);

  if (time <= 0.0) {
    return layer.sample(position);
  }
  if (time >= 1.0) {
    return tex.sample(s, position / size);
  }

  // Per-pixel random values in [0, 1)
  float2 blockID = floor(position);
  float r1 = hash21(blockID);
  float r2 = hash21(blockID + float2(127.1, 311.7));
  float r3 = hash21(blockID + float2(269.5, 183.3));
  float r4 = hash21(blockID + float2(419.2, 53.7));

  // Sweep: bottom-left → upper-right
  float2 uv = position / size;
  float sweepPos = (uv.x + (1.0 - uv.y)) * 0.5;
  float startThreshold = sweepPos * 0.15 + r1 * 0.05;

  // Per-pixel normalized progress [0, 1] on its own timeline for sweep
  float localProgress =
      clamp((time - startThreshold) / (1.0 - startThreshold), 0.0, 1.0);

  // baseAngle ± narrow jitter (0.52 = [-0.26, 0.26) ≒ ±15°)
  float angle = baseAngle + (r2 - 0.5) * 0.52;

  float2 dir = float2(cos(angle), sin(angle));
  // 90° rotation of dir
  float2 perpDir = float2(-dir.y, dir.x);

  // ~70% of height so a pixel visibly migrates to a different region (±30% jitter)
  float maxDist = size.y * 0.7 * (0.7 + r3 * 0.6);

  // Eased travel progress 0 → maxDist
  float eased = smoothstep(0.0, 1.0, localProgress);
  float mag = eased * maxDist;

  // Per-pixel sway range in ±15 px
  float swayAmplitude = (r4 - 0.5) * 30.0;
  // Perpendicular sway, peaks mid-travel and returns to 0
  float wobble = sin(localProgress * 3.14159265) * swayAmplitude;

  // At time=0: samplePosA = position, samplePosB = far ahead.
  float2 samplePosA = position - dir * mag + perpDir * wobble;
  // At time=1: samplePosA = far back, samplePosB = position.
  float2 samplePosB = position + dir * (maxDist - mag) + perpDir * wobble;

  // Layer has no sampler config, so manually return transparent when out of bounds
  half4 a = half4(0.0);
  if (samplePosA.x >= 0.0 && samplePosA.x <= size.x &&
      samplePosA.y >= 0.0 && samplePosA.y <= size.y) {
    a = layer.sample(samplePosA);
  }
  // tex uses `clamp_to_zero`, so out-of-bounds is already transparent
  half4 b = tex.sample(s, samplePosB / size);

  // S-curve blend keeps A and B distinct near the ends, switches sharply mid-way
  float blend = smoothstep(0.0, 1.0, localProgress);
  return mix(a, b, half(blend));
}
