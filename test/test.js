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

    it('should set rating from data-rating if present', function() {

        const dom2 = new JSDOM(`<!DOCTYPE html><div data-rating="4" id="rater">test</div>`);
        const element2 = dom2.window.document.querySelector("#rater");

        let rater = raterJs({ element:element2});
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

    
    it('setRating should throw when rating is below 0', function() {
        let rater = raterJs({ element:element, rating:3 });

        assert.throws(() => {
            rater.setRating(-1);
        });

        assert.throws(() => {
            rater.setRating(-0.1);
        });
    });

    it('setRating should throw when rating is above max', function() {
        let rater = raterJs({ element:element, max:5 });

        assert.throws(() => {
            rater.setRating(6);
        });

        assert.throws(() => {
            rater.setRating(5.1);
        });
    });

    it('setRating should throw when rating is not a number', function() {
        let rater = raterJs({ element:element, max:5 });

        assert.throws(() => {
            rater.setRating(undefined);
        });

        assert.throws(() => {
            rater.setRating("3");
        });
    });

    it('should throw when step is 0 or below', function() {
       
        assert.throws(() => {
            let rater = raterJs({ element:element, step:0 });
        });

        assert.throws(() => {
            let rater = raterJs({ element:element, step:-0.0001 });
        });
    });

    it('should throw when step is above 1', function() {
               
        assert.throws(() => {
            raterJs({ element:element, step:1.0001 });
        });
    });

    it('should not throw when step is between 0 and 1', function() {
        
        assert.doesNotThrow(() => {
            let rater = raterJs({ element:element, step: 0.01 });
        });

        assert.doesNotThrow(() => {
            let rater = raterJs({ element:element, step:0.999 });
        });
    });

});