/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 27/08/2013
 * Time: 19:00
 * To change this template use File | Settings | File Templates.
 */

(function(){

    "use strict";

    
    function Mesh(gl, program, vertices, vComponents, indices, texCoordinates) {
        this.gl = gl;
        this.program = program;


        this.vertextBuffer = createArrayBuffer(gl, vertices, vComponents);
        gl.vertexAttribPointer(program.vertexPosAttrib, this.vertextBuffer.numComponents, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(program.vertexPosAttrib);

        this.indexBuffer = createElementArrayBuffer(gl, indices, 1)

        
        this.textureCoordBuffer = createArrayBuffer(gl, texCoordinates, 2);
        gl.vertexAttribPointer(program.textureCoordAttrib, this.textureCoordBuffer.numComponents, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(program.textureCoordAttrib);

    }

    Mesh.prototype = {

        draw : function() {
            //this.bind();
            var gl = this.gl;
            gl.useProgram(this.program);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            //this.unbind();
        },

        bind : function() {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertextBuffer);
        },

        unbind: function() {
            var gl = this.gl;
            var program = this.program;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertextBuffer);
            gl.disableVertexAttribArray(program.vertexPosAttrib);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
            gl.disableVertexAttribArray(program.textureCoordAttrib);
        }

    }

    function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error('Shader Compilation Error: ' + gl.getShaderInfoLog(shader) );
            return null;
        }

        return shader;
    }

    function createProgram(gl, shaders) {
        var p = gl.createProgram();
        gl.attachShader(p, shaders[0]);
        gl.attachShader(p, shaders[1]);
        gl.linkProgram(p);

        if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
            throw new Error('Shader Program Link Error: ' + gl.getProgramInfoLog(p));
            return null;
        }
        return p;
    }

    function getGL(canvas, options) {
        try {
            gl = canvas.getContext("experimental-webgl", options);
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;


            return gl
        } catch (e) {
        }
        if (!gl) {
            throw new Error("Could not initialise WebGL");
        }

    }

    function screenQuad(gl) {
        var vertexPosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
        var vertices = [ -1.0,-1.0,
                    1.0,-1.0,
                    1.0,1.0,
                    -1.0,1.0];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        vertexPosBuffer.numComponents = 2;
        vertexPosBuffer.numItems = 4;
        return vertexPosBuffer;
    }

    function createArrayBuffer(gl, vertices, components) {
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        buffer.numComponents = components;
        buffer.numItems = vertices.length / components;
        return buffer;
    }

    function createElementArrayBuffer(gl, indices, components) {
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        buffer.numComponents = components;
        buffer.numItems = indices.length / components;
        return buffer;
    }

    function createTexture(gl) {
        var t = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return t;
    }

    function createStateTexture(gl) {
        var t = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return t;
    }


    function raf() {

        window.requestAnimFrame = (function(){
            return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
        })();
    }

    window.glt = {

        Mesh : Mesh,

        compileShader : function(gl, shader) {
            return getShader(gl, shader);
        },

        createTexture : function(gl) {
            return createTexture(gl);
        },

        createStateTexture : function(gl) {
            return createStateTexture(gl);
        },

        createProgram : function(gl, shaders) {
            return createProgram(gl, shaders);
        },

        getGL : function(canvas, options) {
            return getGL(canvas);
        },

        screenQuad : function(gl) {
            return screenQuad(gl);
        },

        createArrayBuffer : function(gl, vertices, components) {
            return createArrayBuffer(gl, vertices, components);
        },

        raf : function() {
            raf();
        }


    }

})()