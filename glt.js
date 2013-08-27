/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 27/08/2013
 * Time: 19:00
 * To change this template use File | Settings | File Templates.
 */

(function(){

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
            throw new Error('Shader Compilation Error');
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
            throw new Error('Shader Program Link Error');
            return null;
        }
        return p;
    }

    function getGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl");
            console.log('HERE')
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;

            return gl
        } catch (e) {
        }
        if (!gl) {
            throw new Error("Could not initialise WebGL");
        }

    }


    window.glt = {

        compileShader : function(gl, shader) {
            return getShader(gl, shader);
        },

        loadShader : function() {

        },

        createProgram : function(gl, shaders) {
            return createProgram(gl, shaders);
        },

        getGL : function(canvas) {
            return getGL(canvas);
        }



    }

})()