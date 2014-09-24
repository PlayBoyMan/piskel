jQuery.namespace = function() {
  var a=arguments, o=null, i, j, d;
  for (i=0; i<a.length; i=i+1) {
    d=a[i].split(".");
    o=window;
    for (j=0; j<d.length; j=j+1) {
      o[d[j]]=o[d[j]] || {};
      o=o[d[j]];
    }
  }
  return o;
};

/**
 * Need a polyfill for PhantomJS
 */
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var bindArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          var args = bindArgs.concat(Array.prototype.slice.call(arguments));
          return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, args);
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

/**
 * @provide pskl.utils
 *
 * @require Constants
 */
(function() { // namespace: pskl.utils

  var ns = $.namespace("pskl.utils");

  /**
   * Convert a rgb(Number, Number, Number) color to hexadecimal representation
   * @param  {Number} r red value, between 0 and 255
   * @param  {Number} g green value, between 0 and 255
   * @param  {Number} b blue value, between 0 and 255
   * @return {String} hex representation of the color '#ABCDEF'
   */
  ns.rgbToHex = function (r, g, b) {
    return "#" + pskl.utils.componentToHex(r) + pskl.utils.componentToHex(g) + pskl.utils.componentToHex(b);
  };

  /**
   * Convert a color component (as a Number between 0 and 255) to its string hexa representation
   * @param  {Number} c component value, between 0 and 255
   * @return {String} eg. '0A'
   */
  ns.componentToHex = function (c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };

  ns.normalize = function (value, def) {
    if (typeof value === 'undefined' || value === null) {
      return def;
    } else {
      return value;
    }
  };

  ns.inherit = function(extendedObject, inheritFrom) {
    extendedObject.prototype = Object.create(inheritFrom.prototype);
    extendedObject.prototype.constructor = extendedObject;
    extendedObject.prototype.superclass = inheritFrom.prototype;
  };

  ns.wrap = function (wrapper, wrappedObject) {
    for (var prop in wrappedObject) {
      if (typeof wrappedObject[prop] === 'function' && typeof wrapper[prop] === 'undefined') {
        wrapper[prop] = wrappedObject[prop].bind(wrappedObject);
      }
    }
  };

  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  ns.escapeHtml= function (string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  };

  var reEntityMap = {};
  ns.unescapeHtml= function (string) {
    Object.keys(entityMap).forEach(function(key) {
      reEntityMap[key] = reEntityMap[key] || new RegExp(entityMap[key], "g");
      string = string.replace(reEntityMap[key], key);
    });
    return string;
  };

})();

