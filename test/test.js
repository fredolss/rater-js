var assert = require('assert');
var raterJs = require('../lib/rater-js');
var sinon = require('sinon');
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

    it('getRating should return the initial rating', function() {
           let rater = raterJs({ element:element, rating:3 });
           assert.equal(rater.getRating(),3);
    });

    it('getRating should return the changed rating', function() {
        let rater = raterJs({ element:element, rating:3 });
        rater.setRating(4);
        assert.equal(rater.getRating(),4);
    });

    it('clicking a the star should trigger callback', function() {
        let callbackSpy = sinon.spy();
        let rater = raterJs({ element:element, rating:3, rateCallback:callbackSpy });
        var evt = global.document.createEvent("HTMLEvents");
        evt.initEvent("click", false, true);
        element.dispatchEvent(evt);
        sinon.assert.calledOnce(callbackSpy);
    });
});