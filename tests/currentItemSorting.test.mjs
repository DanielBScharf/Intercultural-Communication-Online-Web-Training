import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {cultureModule} from '../modules/culture.js';
const lesson=cultureModule.lessons.find(page=>page.id==='culture-iceberg-sort');
class Element {
    constructor(){this.children=[];this.listeners={};this.hidden=false;this.dataset={};}
    set innerHTML(value){this.children=[];this.html=value;}
    get innerHTML(){return this.html||'';}
    append(...nodes){this.children.push(...nodes);}
    appendChild(node){this.children.push(node);}
    addEventListener(event,callback){this.listeners[event]=callback;}
    focus(){this.focused=true;}
    click(){this.listeners.click();}
}
function fixture(items=lesson.items){
    const nodes=Object.fromEntries(['sortingCurrentItem','sortingCounter','sortingFeedback','sortingNextItem'].map(id=>[id,new Element()]));
    nodes.sortingNextItem.hidden=true;nodes.sortingCounter.textContent=`1 of ${items.length}`;nodes.sortingCurrentItem.textContent=items[0].text;
    const lists={visible:new Element(),hidden:new Element()};
    const choices=['visible','hidden'].map(key=>{const button=new Element();button.dataset.currentSortChoice=key;return button;});
    const document={getElementById:id=>nodes[id],querySelectorAll:()=>choices,querySelector:selector=>lists[selector.includes('"visible"')?'visible':'hidden'],createElement:()=>new Element()};
    const source=readFileSync(new URL('../js/activities.js',import.meta.url),'utf8');
    const helper=source.slice(source.indexOf('function initializeCurrentItemSorting('),source.indexOf('function createSortedItemReview('));
    const initialize=vm.runInNewContext(helper+';initializeCurrentItemSorting',{document,createSortedItemReview:(item,index)=>({item,index})});
    initialize({...lesson,currentItemOrder:items});
    return {nodes,lists,choices};
}
test('Iceberg retains exactly the requested five visible and five less visible items with unchanged feedback',()=>{
    const expectedVisible=['Greetings','Dining practices','Forms of address','Personal appearance','Common gestures'];
    const expectedHidden=['Attitudes toward authority','Expectations about privacy','Ideas about fairness','Expectations about hospitality','Approaches to conflict'];
    assert.deepEqual(lesson.items.filter(item=>item.answer==='visible').map(item=>item.text),expectedVisible);
    assert.deepEqual(lesson.items.filter(item=>item.answer==='hidden').map(item=>item.text),expectedHidden);
    const feedbackHashes=["f4d170dcb3e2abed92e8b84d370981771c2ccd0cb98d13731ab0859d98a54cb7","66909cb96fe7ed97d897ca5c6bcc44ef64a851d217f1653c89f0190ae1e66bc0","07b218557fce0f96c80d3b107d085c55b3b5b8e8f4e841543bf13e850e6db875","edc7d7d59b906b2b587cc3fa11af9ac6a443ab0b78b5a4653618c604ec25111a","9813f23d9172974aeaec8c049f2cedfa27f16b6a498cbc4d2a3399175b379008","f77a26c00dcafb823b441a29dd9032505e2d9f194a78f39c409efbc885985c4d","e7f0a88087c542a309a0fd43a2ccbc44af13dd2bd1338bc9d381bd8f2828b43c","8ba5b69d1205aa5bc098965a4e8c5134cf2613542f1849a7cd7c0ad5f59969fc","b7b80ba0cbdf990cb1ade3ba3ff759c543f9243fa6f7a0b7be2719c8b823845e","e7d548002e3f292f4816158206db9a83a193a27872724e5135da9b771aef83f4"];
    lesson.items.forEach((item,index)=>assert.equal(createHash('sha256').update(item.feedback).digest('hex'),feedbackHashes[index]));
    assert.equal(cultureModule.lessons.length,15);
});
test('both incorrect directions preserve item, count and lists, hiding full explanations',()=>{
    for(const item of [lesson.items[0],lesson.items[5]]){
        const {nodes,lists,choices}=fixture([item,...lesson.items.filter(other=>other!==item)]);
        choices.find(button=>button.dataset.currentSortChoice!==item.answer).click();
        const text=nodes.sortingFeedback.children[0].textContent;
        assert.equal(text,item.answer==='hidden'?'Look again. Is this something you can directly observe, or is it an underlying value, expectation, or assumption that may influence what you can see?':'Look again. Can you directly observe this behavior, practice, or expression of culture, even if its meaning may be influenced by something less visible?');
        assert.equal(nodes.sortingCurrentItem.textContent,item.text);
        assert.equal(nodes.sortingCounter.textContent,'1 of 10');
        assert.equal(lists.visible.children.length+lists.hidden.children.length,0);
        assert.equal(nodes.sortingNextItem.hidden,true);
        assert.notEqual(text,item.feedback);
        choices.find(button=>button.dataset.currentSortChoice===item.answer).click();
        assert.equal(nodes.sortingFeedback.children[0].children[1].textContent,item.feedback);
    }
});
test('correct feedback waits for explicit Next Item, prevents repeat scoring, and focuses the new item',()=>{
    const {nodes,lists,choices}=fixture();
    choices[0].click();choices[0].click();
    assert.equal(nodes.sortingFeedback.children[0].children[0].textContent,"That's it.");
    assert.equal(nodes.sortingCounter.textContent,'1 of 10');
    assert.equal(lists.visible.children.length,0);
    assert.equal(nodes.sortingNextItem.hidden,false);
    assert.equal(nodes.sortingNextItem.focused,true);
    nodes.sortingNextItem.click();
    assert.equal(lists.visible.children.length,1);
    assert.equal(lists.visible.children[0].item,lesson.items[0]);
    assert.equal(nodes.sortingCounter.textContent,'2 of 10');
    assert.equal(nodes.sortingCurrentItem.textContent,lesson.items[1].text);
    assert.equal(nodes.sortingCurrentItem.focused,true);
    assert.equal(nodes.sortingFeedback.children.length,0);
    assert.equal(nodes.sortingNextItem.hidden,true);
    assert.equal(choices.every(button=>!button.disabled),true);
});
test('all ten items reach their own reference lists and final feedback completes without Next Item',()=>{
    const {nodes,lists,choices}=fixture();
    for(const [index,item]of lesson.items.entries()){
        assert.equal(nodes.sortingCounter.textContent,`${index+1} of 10`);
        choices.find(button=>button.dataset.currentSortChoice===item.answer).click();
        assert.equal(nodes.sortingFeedback.children[0].children[1].textContent,item.feedback);
        if(index<9)nodes.sortingNextItem.click();
    }
    assert.equal(lists.visible.children.length,5);assert.equal(lists.hidden.children.length,5);
    assert.equal(nodes.sortingNextItem.hidden,true);
    assert.match(nodes.sortingFeedback.children[1].textContent,/10 \/ 10 correct/);
    assert.equal(nodes.sortingFeedback.focused,true);
});
