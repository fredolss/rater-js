var assert = require('assert');
var raterJs = require('../lib/rater-js');
var sinon = require('sinon');
var jsdom = require('jsdom');
const { JSDOM } = jsdom;

describe('RaterJs', function() {
      
    it('should throw when element is missing', function() {
        assert.throws(() => {
            raterJs();
          });
    });

    it('should create new rater without throwing error', function() {

        const dom = new JSDOM(`<!DOCTYPE html><div id="rater">test</div>`);
        const element = dom.window.document.querySelector("#rater");
        global.document = dom.window.document;

        assert.doesNotThrow(() => {
            raterJs({ element:element });
          });
    });

    it('getRating should return null when no rating is set', function() {

        const dom = new JSDOM(`<!DOCTYPE html><div id="rater">test</div>`);
        const element = dom.window.document.querySelector("#rater");
        global.document = dom.window.document;

        let rater = raterJs({ element:element });
        assert.equal(rater.getRating(),null);
    });

    it('getRating should return null after clear', function() {
        const dom = new JSDOM(`<!DOCTYPE html><div id="rater">test</div>`);
        const element = dom.window.document.querySelector("#rater");
        global.document = dom.window.document;

        let rater = raterJs({ element:element });
        rater.setRating(2);
        rater.clear();
        assert.equal( rater.getRating(),null);
    });


    it('getRating should return the initial rating', function() {
        const dom = new JSDOM(`<!DOCTYPE html><div id="rater">test</div>`);
        const element = dom.window.document.querySelector("#rater");
        global.document = dom.window.document;

        let rater = raterJs({ element:element, rating:3 });
        assert.equal(rater.getRating(),3);
    });

    it('getRating should return the changed rating', function() {

        const dom = new JSDOM(`<!DOCTYPE html><div id="rater">test</div>`);
        const element = dom.window.document.querySelector("#rater");
        global.document = dom.window.document;

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
        const dom = new JSDOM(`<!DOCTYPE html><div id="rater">test</div>`);
        const element = dom.window.document.querySelector("#rater");
        global.document = dom.window.document;

        let callbackContext;
        let callbackSpy = sinon.spy(function(rating, done) {
            callbackContext = this;
            done();
        });
        let rater = raterJs({ element:element, rating:3, rateCallback:callbackSpy });
        var evt = global.document.createEvent("HTMLEvents");
        evt.initEvent("click", false, true);
        element.dispatchEvent(evt);
        sinon.assert.calledOnce(callbackSpy);
        assert.equal(callbackContext, rater);
    });

    it('should create independent raters for every matching element', function() {
        const dom = new JSDOM(`<!DOCTYPE html>
            <div class="rater" data-rating="2"></div>
            <div class="rater" data-rating="4"></div>`);
        global.document = dom.window.document;

        const elements = Array.from(global.document.querySelectorAll(".rater"));
        const raters = elements.map((element) => raterJs({ element:element }));

        assert.equal(raters.length, 2);
        assert.equal(elements[0].querySelectorAll(".star-value").length, 1);
        assert.equal(elements[1].querySelectorAll(".star-value").length, 1);
        assert.equal(raters[0].getRating(), 2);
        assert.equal(raters[1].getRating(), 4);

        raters[0].setRating(1);
        assert.equal(raters[0].getRating(), 1);
        assert.equal(raters[1].getRating(), 4);

        raters[0].clear();
        raters[0].disable();
        assert.equal(raters[0].getRating(), null);
        assert.equal(elements[0].classList.contains("disabled"), true);
        assert.equal(elements[1].classList.contains("disabled"), false);
    });

    it('dispose should remove every listener from only its own element', function() {
        const dom = new JSDOM(`<!DOCTYPE html>
            <div id="first"></div>
            <div id="second"></div>`);
        global.document = dom.window.document;

        const first = global.document.querySelector("#first");
        const second = global.document.querySelector("#second");
        const addListenerSpy = sinon.spy(first, "addEventListener");
        const removeListenerSpy = sinon.spy(first, "removeEventListener");
        const firstCallback = sinon.spy();
        const secondCallback = sinon.spy();
        const firstRater = raterJs({ element:first, rateCallback:firstCallback });
        raterJs({ element:second, rateCallback:secondCallback });
        const registeredListeners = new Map(addListenerSpy.getCalls().map((call) => [call.args[0], call.args[1]]));

        firstRater.dispose();

        ["mousemove", "mouseleave", "click", "touchmove", "touchstart", "touchend", "touchcancel"].forEach((eventName) => {
            const removeCall = removeListenerSpy.getCalls().find((call) => call.args[0] === eventName);
            assert.ok(removeCall, eventName + " listener should be removed");
            assert.equal(removeCall.args[1], registeredListeners.get(eventName));
        });

        const click = global.document.createEvent("HTMLEvents");
        click.initEvent("click", false, true);
        first.dispatchEvent(click);
        second.dispatchEvent(click);

        sinon.assert.notCalled(firstCallback);
        sinon.assert.calledOnce(secondCallback);
    });

    it('should use a two pixel gap by default and fill decimal ratings accurately', function() {
        const dom = new JSDOM(`<!DOCTYPE html><div id="rater"></div>`);
        const element = dom.window.document.querySelector("#rater");
        global.document = dom.window.document;

        const rater = raterJs({ element:element, rating:3.9 });
        const value = element.querySelector(".star-value");

        assert.equal(element.style.width, "88px");
        assert.equal(value.style.width, "68.4px");
        assert.equal(element.style.backgroundPosition, "0px 0px, 18px 0px, 36px 0px, 54px 0px, 72px 0px");

        rater.setRating(3);
        assert.equal(value.style.width, "52px");

        rater.setRating(5);
        assert.equal(value.style.width, "88px");
    });

    it('should preserve the original rendering when starSpacing is zero', function() {
        const dom = new JSDOM(`<!DOCTYPE html><div id="rater"></div>`);
        const element = dom.window.document.querySelector("#rater");
        global.document = dom.window.document;

        raterJs({ element:element, rating:3, starSpacing:0 });

        assert.equal(element.style.width, "80px");
        assert.equal(element.style.backgroundPosition, "");
        assert.equal(element.querySelector(".star-value").style.width, "60%");
    });

    it('should support fractional star spacing', function() {
        const dom = new JSDOM(`<!DOCTYPE html><div id="rater"></div>`);
        const element = dom.window.document.querySelector("#rater");
        global.document = dom.window.document;

        raterJs({ element:element, max:3, rating:2.5, starSpacing:2.5 });

        assert.equal(element.style.width, "53px");
        assert.equal(element.querySelector(".star-value").style.width, "45px");
    });

    it('should reject invalid starSpacing values', function() {
        const invalidValues = [-1, "2", NaN, Infinity, -Infinity];

        invalidValues.forEach((starSpacing) => {
            const dom = new JSDOM(`<!DOCTYPE html><div id="rater"></div>`);
            const element = dom.window.document.querySelector("#rater");
            global.document = dom.window.document;

            assert.throws(() => {
                raterJs({ element:element, starSpacing:starSpacing });
            }, /starSpacing must be a non-negative number/);
        });
    });

    it('should place custom star images in every background layer', function() {
        const dom = new JSDOM(`<!DOCTYPE html>
            <style>
                .star-rating { background-image: url("off.svg") !important; }
                .star-rating .star-value { background-image: url("on.svg") !important; }
            </style>
            <div id="rater"></div>`);
        const element = dom.window.document.querySelector("#rater");
        global.document = dom.window.document;

        raterJs({ element:element });

        const offImages = element.style.backgroundImage.match(/off\.svg/g) || [];
        const onImages = element.querySelector(".star-value").style.backgroundImage.match(/on\.svg/g) || [];
        assert.equal(offImages.length, 5);
        assert.equal(onImages.length, 5);
    });

    it('should ignore gaps when calculating mouse, touch, step, and RTL ratings', function() {
        const dom = new JSDOM(`<!DOCTYPE html>
            <div id="mouse"></div>
            <div id="touch"></div>
            <div id="rtl"></div>`);
        global.document = dom.window.document;
        global.window = dom.window;

        const mouseElement = global.document.querySelector("#mouse");
        const touchElement = global.document.querySelector("#touch");
        const rtlElement = global.document.querySelector("#rtl");
        [mouseElement, touchElement, rtlElement].forEach((element) => {
            Object.defineProperty(element, "offsetWidth", { value:88 });
            element.getBoundingClientRect = () => ({ left:0 });
        });

        const mouseHover = sinon.spy();
        const touchHover = sinon.spy();
        const rtlHover = sinon.spy();
        raterJs({ element:mouseElement, step:0.1, onHover:mouseHover });
        raterJs({ element:touchElement, step:0.5, onHover:touchHover });
        raterJs({ element:rtlElement, step:0.1, reverse:true, onHover:rtlHover });

        const gapEvent = new dom.window.MouseEvent("mousemove", { bubbles:true, clientX:17 });
        mouseElement.dispatchEvent(gapEvent);
        assert.equal(mouseHover.lastCall.args[0], 1);

        const decimalEvent = new dom.window.MouseEvent("mousemove", { bubbles:true, clientX:68.4 });
        mouseElement.querySelector(".star-value").dispatchEvent(decimalEvent);
        assert.ok(Math.abs(mouseHover.lastCall.args[0] - 3.9) < 0.000001);

        const edgeEvent = new dom.window.MouseEvent("mousemove", { bubbles:true, clientX:88 });
        mouseElement.dispatchEvent(edgeEvent);
        assert.equal(mouseHover.lastCall.args[0], 5);

        const touchEvent = new dom.window.Event("touchmove", { bubbles:true, cancelable:true });
        Object.defineProperty(touchEvent, "changedTouches", { value:[{ pageX:21.2 }] });
        touchElement.dispatchEvent(touchEvent);
        assert.equal(touchHover.lastCall.args[0], 1.5);

        const rtlEvent = new dom.window.MouseEvent("mousemove", { bubbles:true, clientX:19.6 });
        rtlElement.dispatchEvent(rtlEvent);
        assert.ok(Math.abs(rtlHover.lastCall.args[0] - 3.9) < 0.000001);
    });

    
    it('setRating should throw when rating is below 0', function() {
        const dom = new JSDOM(`<!DOCTYPE html><div id="rater">test</div>`);
        const element = dom.window.document.querySelector("#rater");
        global.document = dom.window.document;

        let rater = raterJs({ element:element, rating:3 });

        assert.throws(() => {
            rater.setRating(-1);
        });

        assert.throws(() => {
            rater.setRating(-0.1);
        });
    });

    it('setRating should throw when rating is above max', function() {
        const dom = new JSDOM(`<!DOCTYPE html><div id="rater">test</div>`);
        const element = dom.window.document.querySelector("#rater");
        global.document = dom.window.document;

        let rater = raterJs({ element:element, max:5 });

        assert.throws(() => {
            rater.setRating(6);
        });

        assert.throws(() => {
            rater.setRating(5.1);
        });
    });

    it('setRating should throw when rating is not a number', function() {
        const dom = new JSDOM(`<!DOCTYPE html><div id="rater">test</div>`);
        const element = dom.window.document.querySelector("#rater");
        global.document = dom.window.document;

        let rater = raterJs({ element:element, max:5 });

        assert.throws(() => {
            rater.setRating(undefined);
        });

        assert.throws(() => {
            rater.setRating("3");
        });
    });

    it('should throw when step is 0 or below', function() {
        const dom = new JSDOM(`<!DOCTYPE html><div id="rater">test</div>`);
        const element = dom.window.document.querySelector("#rater");
        global.document = dom.window.document;
       
        assert.throws(() => {
            let rater = raterJs({ element:element, step:0 });
        });

        assert.throws(() => {
            let rater = raterJs({ element:element, step:-0.0001 });
        });
    });

    it('should throw when step is above 1', function() {
        const dom = new JSDOM(`<!DOCTYPE html><div id="rater">test</div>`);
        const element = dom.window.document.querySelector("#rater");
        global.document = dom.window.document;

        assert.throws(() => {
            raterJs({ element:element, step:1.0001 });
        });
    });

    it('should not throw when step is between 0 and 1', function() {
        const dom = new JSDOM(`<!DOCTYPE html><div id="rater">test</div>`);
        const element = dom.window.document.querySelector("#rater");
        global.document = dom.window.document;

        assert.doesNotThrow(() => {
            let rater = raterJs({ element:element, step: 0.01 });
        });

        assert.doesNotThrow(() => {
            let rater = raterJs({ element:element, step:0.999 });
        });
    });


    it('element should return original element', function() {
        const dom = new JSDOM(`<!DOCTYPE html><div id="rater">test</div>`);
        const element = dom.window.document.querySelector("#rater");
        global.document = dom.window.document;
        let rater = raterJs({ element:element });

        assert.equal(rater.element,element);
    });
});
