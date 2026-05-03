(() => {
  const canvas = document.getElementById('glcanvas');
  const gl = canvas.getContext('webgl');
  if (!gl) {
    alert('WebGL not supported');
    return;
  }

  const vertexSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = (a_position + 1.0) * 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragmentSource = `
    precision highp float;
    varying vec2 v_uv;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    const float margin = 0.00001;

    float edgeFactor(vec2 uv) {
      float left = smoothstep(margin, margin + 0.02, uv.x);
      float right = smoothstep(1.0 - margin, 1.0 - margin - 0.02, uv.x);
      float top = smoothstep(margin, margin + 0.02, uv.y);
      float bottom = smoothstep(1.0 - margin, 1.0 - margin - 0.02, uv.y);
      return 1.0 - min(min(left, right), min(top, bottom));
    }

    vec3 rainbow(float t) {
      return vec3(
        0.7 + 0.3 * cos(6.28318 * (t + 0.85)),  // Red channel shifted to pinks
        0.3 + 0.5 * cos(6.28318 * (t + 0.3)),   // Green channel reduced, keeping it low for purples
        0.7 + 0.3 * cos(6.28318 * (t + 0.0))    // Blue channel strong for blues
      );
    }


    void main() {
      vec2 uv = v_uv;

      if (uv.x < margin || uv.x > 1.0 - margin || uv.y < margin || uv.y > 1.0 - margin) {
        gl_FragColor = vec4(0.0);
        return;
      }

      vec2 mouseUV = u_mouse / u_resolution;
      mouseUV = clamp(mouseUV, vec2(margin), vec2(1.0 - margin));
      float distMouse = distance(uv, mouseUV);
      float ef = edgeFactor(uv);

      float refraction = smoothstep(0.3, 0.0, distMouse) * ef;

      vec2 dir = normalize(uv - mouseUV);
      float intensity = pow(refraction, 2.5) * 0.07;

      float freq = 60.0;
      float phase = dot(uv * freq, vec2(15.0, 23.0));
      float warpAmount = sin(phase + distMouse * 20.0) * intensity * 6.0;

      vec2 offset = dir * intensity + vec2(-dir.y, dir.x) * warpAmount;
      vec2 refractedUV = uv + offset;

      float angle = atan(dir.y, dir.x) / 6.28318 + 0.5;

      vec3 baseColor = vec3(0.0);
      baseColor += rainbow(angle) * refraction * 2.5;

      gl_FragColor = vec4(baseColor, 1.0);
    }
  `;

  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    return;
  }

  gl.useProgram(program);

  const positionLoc = gl.getAttribLocation(program, 'a_position');
  const resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
  const mouseLoc = gl.getUniformLocation(program, 'u_mouse');

  // Fullscreen quad
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

  let mousePos = [window.innerWidth/2, window.innerHeight/2];

  window.addEventListener('mousemove', (e) => {
    mousePos = [e.clientX, window.innerHeight - e.clientY];
  });

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  resize();
  window.addEventListener('resize', resize);

  function render() {
    gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
    gl.uniform2f(mouseLoc, mousePos[0], mousePos[1]);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
