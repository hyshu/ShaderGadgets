#include <flutter/runtime_effect.glsl>

uniform vec2 uTextureSize;
uniform vec2 uContentOrigin;
uniform vec2 uContentSize;
uniform float uTime;
uniform float uBaseAngle;
uniform sampler2D uTextureA;
uniform sampler2D uTextureB;

out vec4 fragColor;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec4 sampleTexture(sampler2D textureSampler, vec2 uv) {
  // Impeller's OpenGLES backend supplies engine textures with flipped Y
  // https://docs.flutter.dev/ui/design/graphics/fragment-shaders
#ifdef IMPELLER_TARGET_OPENGLES
  uv.y = 1.0 - uv.y;
#endif
  return texture(textureSampler, uv);
}

void main() {
  vec2 texturePosition = FlutterFragCoord().xy;
  vec2 position = texturePosition - uContentOrigin;
  vec2 textureUV = texturePosition / uTextureSize;
  vec2 contentUV = position / uContentSize;

  if (uTime <= 0.0) {
    fragColor = sampleTexture(uTextureA, textureUV);
    return;
  }
  if (uTime >= 1.0) {
    fragColor = sampleTexture(uTextureB, textureUV);
    return;
  }

  // Per-pixel random values in [0, 1)
  vec2 blockID = floor(position);
  float r1 = hash21(blockID);
  float r2 = hash21(blockID + vec2(127.1, 311.7));
  float r3 = hash21(blockID + vec2(269.5, 183.3));
  float r4 = hash21(blockID + vec2(419.2, 53.7));

  // Sweep: bottom-left to upper-right
  float sweepPos = (contentUV.x + (1.0 - contentUV.y)) * 0.5;
  float startThreshold = sweepPos * 0.15 + r1 * 0.05;

  // Per-pixel normalized progress [0, 1] on its own timeline for sweep
  float localProgress =
      clamp((uTime - startThreshold) / (1.0 - startThreshold), 0.0, 1.0);

  // base angle +/- narrow jitter (0.52 = [-0.26, 0.26), about +/-15 deg)
  float angle = uBaseAngle + (r2 - 0.5) * 0.52;
  vec2 dir = vec2(cos(angle), sin(angle));
  // 90 degree rotation of dir
  vec2 perpDir = vec2(-dir.y, dir.x);

  // Around 70% of height so a pixel visibly migrates to a different region,
  // with +/-30% jitter.
  float maxDist = uContentSize.y * 0.7 * (0.7 + r3 * 0.6);

  // Eased travel progress 0 to maxDist
  float eased = smoothstep(0.0, 1.0, localProgress);
  float mag = eased * maxDist;

  // Per-pixel perpendicular sway range in +/-15 px, peaking mid-travel and
  // returning to 0.
  float wobble = sin(localProgress * 3.14159265) * ((r4 - 0.5) * 30.0);

  // At time=0: samplePosA = position, samplePosB = far ahead.
  vec2 samplePosA = position - dir * mag + perpDir * wobble;
  // At time=1: samplePosA = far back, samplePosB = position.
  vec2 samplePosB = position + dir * (maxDist - mag) + perpDir * wobble;

  // Texture sampling clamps by default, so manually return transparent when
  // sampling outside the content area.
  vec4 a = vec4(0.0);
  if (samplePosA.x >= 0.0 && samplePosA.x <= uContentSize.x &&
      samplePosA.y >= 0.0 && samplePosA.y <= uContentSize.y) {
    a = sampleTexture(uTextureA, (uContentOrigin + samplePosA) / uTextureSize);
  }

  vec4 b = vec4(0.0);
  if (samplePosB.x >= 0.0 && samplePosB.x <= uContentSize.x &&
      samplePosB.y >= 0.0 && samplePosB.y <= uContentSize.y) {
    b = sampleTexture(uTextureB, (uContentOrigin + samplePosB) / uTextureSize);
  }

  // S-curve blend keeps A and B distinct near the ends, switches sharply mid-way.
  float blend = smoothstep(0.0, 1.0, localProgress);
  fragColor = mix(a, b, blend);
}
