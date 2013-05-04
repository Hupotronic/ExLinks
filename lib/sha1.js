/**
 * Copyright (c) 2012 T. Michael Keesey
 * LICENSE: http://opensource.org/licenses/MIT
 */
var sha1;
if(typeof module === "undefined") {
  window.SHA1 = sha1;
} else {
  module.exports = sha1;
}

(function (sha1) {
    var POW_2_24 = Math.pow(2, 24);
    var POW_2_32 = Math.pow(2, 32);
    function hex(n) {
        var s = "", v;
        for(var i = 7; i >= 0; --i) {
            v = (n >>> (i << 2)) & 15;
            s += v.toString(16);
        }
        return s;
    }
    function lrot(n, bits) {
        return ((n << bits) | (n >>> (32 - bits)));
    }
    var Uint32ArrayBigEndian = (function () {
        function Uint32ArrayBigEndian(length) {
            this.bytes = new Uint8Array(length << 2);
        }
        Uint32ArrayBigEndian.prototype.get = function (index) {
            index <<= 2;
            return (this.bytes[index] * POW_2_24) + ((this.bytes[index + 1] << 16) | (this.bytes[index + 2] << 8) | this.bytes[index + 3]);
        };
        Uint32ArrayBigEndian.prototype.set = function (index, value) {
            var high = Math.floor(value / POW_2_24), rest = value - (high * POW_2_24);
            index <<= 2;
            this.bytes[index] = high;
            this.bytes[index + 1] = rest >> 16;
            this.bytes[index + 2] = (rest >> 8) & 255;
            this.bytes[index + 3] = rest & 255;
        };
        return Uint32ArrayBigEndian;
    })();    
    function string2ArrayBuffer(s) {
        s = s.replace(/[\u0080-\u07ff]/g, function (c) {
            var code = c.charCodeAt(0);
            return String.fromCharCode(192 | code >> 6, 128 | code & 63);
        });
        s = s.replace(/[\u0080-\uffff]/g, function (c) {
            var code = c.charCodeAt(0);
            return String.fromCharCode(224 | code >> 12, 128 | code >> 6 & 63, 128 | code & 63);
        });
        var n = s.length, array = new Uint8Array(n);
        for(var i = 0; i < n; ++i) {
            array[i] = s.charCodeAt(i);
        }
        return array.buffer;
    }
    function hash(bufferOrString) {
        var source;
        if(bufferOrString instanceof ArrayBuffer) {
            source = bufferOrString;
        } else {
            source = string2ArrayBuffer(String(bufferOrString));
        }
        var h0 = 1732584193, h1 = 4023233417, h2 = 2562383102, h3 = 271733878, h4 = 3285377520, i, sbytes = source.byteLength, sbits = sbytes << 3, minbits = sbits + 65, bits = Math.ceil(minbits / 512) << 9, bytes = bits >>> 3, slen = bytes >>> 2, s = new Uint32ArrayBigEndian(slen), s8 = s.bytes, j, w = new Uint32Array(80), sourceArray = new Uint8Array(source);
        for(i = 0; i < sbytes; ++i) {
            s8[i] = sourceArray[i];
        }
        s8[sbytes] = 128;
        s.set(slen - 2, Math.floor(sbits / POW_2_32));
        s.set(slen - 1, sbits & 4294967295);
        for(i = 0; i < slen; i += 16) {
            for(j = 0; j < 16; ++j) {
                w[j] = s.get(i + j);
            }
            for(; j < 80; ++j) {
                w[j] = lrot(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            }
            var a = h0, b = h1, c = h2, d = h3, e = h4, f, k, temp;
            for(j = 0; j < 80; ++j) {
                if(j < 20) {
                    f = (b & c) | ((~b) & d);
                    k = 1518500249;
                } else {
                    if(j < 40) {
                        f = b ^ c ^ d;
                        k = 1859775393;
                    } else {
                        if(j < 60) {
                            f = (b & c) ^ (b & d) ^ (c & d);
                            k = 2400959708;
                        } else {
                            f = b ^ c ^ d;
                            k = 3395469782;
                        }
                    }
                }
                temp = (lrot(a, 5) + f + e + k + w[j]) & 4294967295;
                e = d;
                d = c;
                c = lrot(b, 30);
                b = a;
                a = temp;
            }
            h0 = (h0 + a) & 4294967295;
            h1 = (h1 + b) & 4294967295;
            h2 = (h2 + c) & 4294967295;
            h3 = (h3 + d) & 4294967295;
            h4 = (h4 + e) & 4294967295;
        }
        return hex(h0) + hex(h1) + hex(h2) + hex(h3) + hex(h4);
    }
    sha1.hash = hash;
})(sha1 || (sha1 = {}));
