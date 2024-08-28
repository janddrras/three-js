uniform float uTime;
uniform sampler2D uPerlin;

varying vec2 vUv;

vec2 rotate2D(vec2 _st, float _angle) {
		float s = sin(_angle);
		float c = cos(_angle);
		mat2 m = mat2(c, s, -s, c);
		return m * _st;
}

void main() {
		vec3 modifiedPosition = position;
		float twistPerlin = texture(uPerlin, vec2(0.5, uv.y * 0.2 - uTime * 0.005)).r;
		float angle = twistPerlin * 10.0;
		vec2 windOffset = vec2(
			texture(uPerlin, vec2(0.25, uTime * 0.01)).r - 0.5, 
			texture(uPerlin, vec2(0.75, uTime * 0.01)).r - 0.5);
		windOffset *= pow(uv.y, 2.0) * 5.0;
		modifiedPosition.xz = rotate2D(modifiedPosition.xz, angle);
		modifiedPosition.xz += windOffset;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(modifiedPosition, 1.0);

		vUv = uv;
}