attribute vec2 a_Position;

uniform mat4 u_MVMatrix;
uniform mat4 u_PMatrix;

void main() {
    gl_Position = vec4(a_pos, 1.0, 1.0);
}