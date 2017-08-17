/** Brick Wall **/

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

// Default attributes provided by THREE.js. Attributes are only available in the
// vertex shader. You can pass them to the fragment shader using varyings
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec2 uv2;

// Examples of variables passed from vertex to fragment shader
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec2 vUv2;

uniform vec3 lightPosition;
varying float LightIntensity;
varying vec2 MCposition;

void main() {

    vNormal = normal;
    vUv = uv;
    vUv2 = uv2;
    vPosition = position;

    vec3 ecPosition = vec3(modelViewMatrix * vec4(position,1.0)).xyz;
    vec3 tnorm = normalize(normalMatrix * normal);
    vec3 lightVec = normalize(lightPosition - ecPosition);
    vec3 reflectVec = reflect(-lightVec,tnorm);
    vec3 viewVec = normalize(-ecPosition);
    float spec = 0.0;
    float diffuse = max(0.0,dot(lightVec,tnorm));
    if(diffuse > 0.0)
    {
        spec = max(0.0,dot(reflectVec,viewVec));
        spec = pow(spec,16.0);
    }

    LightIntensity = 1.0 * diffuse + 0.7 * spec;

    MCposition = position.xy;


    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}