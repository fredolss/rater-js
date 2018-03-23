var assert = require('assert');
var raterJs = require('../lib/rater-js');
var jsdom = require('jsdom');
const { JSDOM, document } = jsdom;

const dom = new JSDOM(`<!DOCTYPE html><div id="rater">test</div>`);
const element = dom.window.document.querySelector("#rater");
global.document = dom.window.document;

describe('RaterJs', function() {
    it('should throw when element is missing', function() {
        assert.throws(() => {
            raterJs();
          });
    });

    it('should create new rater without throwing error', function() {
        assert.doesNotThrow(() => {
            raterJs({ element:element });
          });
    });
});