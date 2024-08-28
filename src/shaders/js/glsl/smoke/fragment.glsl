uniform float uTime;
uniform sampler2D uPerlin;

varying vec2 vUv;

void main() {
	// Scale and animate
	vec2 smokeUv = vUv * 0.5;
	smokeUv.y -= uTime * 0.031;

	// Smoke
	float smoke = texture(uPerlin, smokeUv).r;

	// remap
	smoke = smoothstep(0.4, 1.0, smoke);

	// smoke = 1.0;
	smoke *= smoothstep(0.0, 0.1, vUv.x);
	smoke *= smoothstep(1.0, 0.9, vUv.x);
	smoke *= smoothstep(0.0, 0.1, vUv.y);
	smoke *= smoothstep(1.0, 0.4, vUv.y);

	gl_FragColor = vec4(vec3(1.0), smoke);
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}