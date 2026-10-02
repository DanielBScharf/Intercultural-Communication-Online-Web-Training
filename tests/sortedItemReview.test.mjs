import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {cultureModule} from '../modules/culture.js';

class Element {
    constructor(tag) { this.tagName=tag; this.children=[]; this.listeners={}; this.attrs={}; }
    append(...children) {this.children.push(...children);}
    setAttribute(key,value) {this.attrs[key]=value;}
    addEventListener(type,callback) {(this.listeners[type]??=[]).push(callback);}
    contains(element) {return element===this || this.children.some(child=>child.contains(element));}
    fire(type,event={}) {for(const callback of this.listeners[type]??[]) callback(event);}
}
function fixture(item,index=0) {
    const document={activeElement:null,createElement:tag=>new Element(tag)};
    const source=readFileSync(new URL('../js/activities.js',import.meta.url),'utf8');
    const helper=source.slice(source.indexOf('function createSortedItemReview('),source.indexOf('export function renderImageRevealContent'));
    const create=vm.runInNewContext(helper+';createSortedItemReview',{document});
    const review=create(item,index);
    return {document,review,button:review.children[0],description:review.children[1]};
}
const lesson=cultureModule.lessons.find(lesson=>lesson.type==='sortingActivity');

test('every review reuses its own original item feedback and exposes accessible associations',()=>{
    for(const [index,item] of lesson.items.entries()) {
        const {button,description}=fixture(item,index);
        assert.equal(button.tagName,'button');
        assert.equal(button.textContent,item.text);
        assert.equal(description.textContent,item.feedback);
        assert.equal(description.hidden,true);
        assert.equal(button.attrs['aria-describedby'],description.id);
        assert.equal(button.attrs['aria-controls'],description.id);
        assert.equal(button.attrs['aria-expanded'],'false');
    }
});
test('mouse hover persists over the whole card and closes when the pointer leaves',()=>{
    const {review,button,description}=fixture(lesson.items[0]);
    review.fire('pointerenter',{pointerType:'mouse'});
    assert.equal(description.hidden,false);
    assert.equal(button.attrs['aria-expanded'],'true');
    review.fire('pointerleave');
    assert.equal(description.hidden,true);
    review.fire('pointerenter',{pointerType:'touch'});
    assert.equal(description.hidden,true);
});
test('keyboard focus opens, Escape dismisses without moving focus, and blur closes',()=>{
    const {document,review,button,description}=fixture(lesson.items[0]);
    document.activeElement=button;
    button.fire('focus');
    review.fire('pointerleave');
    assert.equal(description.hidden,false);
    review.fire('keydown',{key:'Escape',stopPropagation(){}});
    assert.equal(description.hidden,true);
    assert.equal(document.activeElement,button);
    button.fire('focus');
    assert.equal(description.hidden,false);
    review.fire('focusout',{relatedTarget:null});
    assert.equal(description.hidden,true);
});
test('click/tap toggles independently of preceding focus and mouse hover',()=>{
    const {review,button,description}=fixture(lesson.items[0]);
    button.fire('focus');
    button.fire('click');
    assert.equal(description.hidden,false);
    review.fire('pointerleave');
    assert.equal(description.hidden,false);
    button.fire('click');
    assert.equal(description.hidden,true);
    button.fire('click');
    assert.equal(description.hidden,false);
    review.fire('focusout',{relatedTarget:null});
    assert.equal(description.hidden,true);
});
