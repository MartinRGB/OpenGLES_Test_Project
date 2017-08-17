/** Brick Wall **/

// Set the precision for data types used in this shader
precision highp float;
precision highp int;

// Default THREE.js uniforms available to both fragment and vertex shader
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;

// Default uniforms provided by ShaderFrog.
uniform vec3 cameraPosition;
uniform float time;

// A uniform unique to this shader. You can modify it to the using the form
// below the shader preview. Any uniform you add is automatically given a form
uniform vec3 lightPosition;

// Example varyings passed from the vertex shader
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec2 vUv2;

uniform vec3 BrickColor;
uniform vec3 MortarColor;
uniform vec2 BrickSize;
uniform vec2 BrickPct;
uniform sampler2D textureMap;
varying float LightIntensity;
varying vec2 MCposition;

void main() {

    vec3 color;
    vec2 position,useBrick;

    position = MCposition/BrickSize;

    if(floor(mod(position.y,2.)) > 0.){
        position.x += 0.5 + fract(time);
    }
    else{
        position.x -= 0.5 + fract(time);
    }

    position = fract(position);

    vec4 noiseTex= texture2D(textureMap,position);

    useBrick = step(position,BrickPct);


    color = mix(MortarColor,BrickColor,useBrick.x * useBrick.y);

    color *= LightIntensity;

    gl_FragColor =  noiseTex*0.6 + vec4(color,1.0);

}