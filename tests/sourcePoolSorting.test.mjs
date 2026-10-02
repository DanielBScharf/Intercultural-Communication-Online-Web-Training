import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {cultureModule} from '../modules/culture.js';
const lesson=cultureModule.lessons.find(page=>page.id==='culture-iceberg-sort');
class Element {
    constructor(){this.children=[];this.listeners={};this.hidden=false;this.dataset={};this.attrs={};this.marker={hidden:true};}
    set innerHTML(value){this.children=[];this.html=value;}
    get innerHTML(){return this.html||'';}
    append(...nodes){this.children.push(...nodes);}
    appendChild(node){this.children.push(node);}
    addEventListener(event,callback){this.listeners[event]=callback;}
    focus(){this.focused=true;}
    click(){this.listeners.click();}
    setAttribute(key,value){this.attrs[key]=value;}
    querySelector(){return this.marker;}
    remove(){this.removed=true;}
}
function fixture(saved=new Map()) {
    const nodes=Object.fromEntries(['sortingSelection','sortingSelectionLabel','sortingSelectedItem','sortingChoiceGroup','sortingCounter','sortingFeedback','sortingCompletion'].map(id=>[id,new Element()]));
    const lists={visible:new Element(),hidden:new Element()};
    const choices=['visible','hidden'].map(key=>{const button=new Element();button.dataset.poolSortChoice=key;return button;});
    let sources=[];
    const document={getElementById:id=>nodes[id],querySelectorAll:selector=>selector.includes('data-pool-sort-index')?sources:choices,querySelector:selector=>lists[selector.includes('"visible"')?'visible':'hidden'],createElement:()=>new Element()};
    const source=readFileSync(new URL('../js/activities.js',import.meta.url),'utf8');
    const helper=source.slice(source.indexOf('function getSourcePoolState('),source.indexOf('function createSortedItemReview('));
    const context={document,loadItem:(key,fallback)=>saved.get(key)??fallback,saveItem:(key,value)=>saved.set(key,value),shuffleItems:items=>[...items],createSortedItemReview:(item,index)=>({item,index})};
    vm.createContext(context);
    vm.runInContext(helper+';globalThis.pool={renderSourcePoolSorting,initializeSourcePoolSorting};',context);
    const data={...lesson};
    const html=context.pool.renderSourcePoolSorting(data);
    sources=data.currentItemOrder.flatMap((item,index)=>{if(data.sortedItemTexts.has(item.text))return[];const button=new Element();button.dataset.poolSortIndex=String(index);button.item=item;return[button];});
    nodes.sortingCounter.textContent=`${data.sortedItemTexts.size} of 10 sorted`;
    context.pool.initializeSourcePoolSorting(data);
    return {nodes,lists,choices,sources,saved,html};
}

test('exactly ten requested items and explanations remain; module count stays unchanged',()=>{
    assert.deepEqual(lesson.items.filter(item=>item.answer==='visible').map(item=>item.text),['Greetings','Dining practices','Forms of address','Personal appearance','Common gestures']);
    assert.deepEqual(lesson.items.filter(item=>item.answer==='hidden').map(item=>item.text),['Attitudes toward authority','Expectations about privacy','Ideas about fairness','Expectations about hospitality','Approaches to conflict']);
    const feedbackHashes=["f4d170dcb3e2abed92e8b84d370981771c2ccd0cb98d13731ab0859d98a54cb7","66909cb96fe7ed97d897ca5c6bcc44ef64a851d217f1653c89f0190ae1e66bc0","07b218557fce0f96c80d3b107d085c55b3b5b8e8f4e841543bf13e850e6db875","edc7d7d59b906b2b587cc3fa11af9ac6a443ab0b78b5a4653618c604ec25111a","9813f23d9172974aeaec8c049f2cedfa27f16b6a498cbc4d2a3399175b379008","f77a26c00dcafb823b441a29dd9032505e2d9f194a78f39c409efbc885985c4d","e7f0a88087c542a309a0fd43a2ccbc44af13dd2bd1338bc9d381bd8f2828b43c","8ba5b69d1205aa5bc098965a4e8c5134cf2613542f1849a7cd7c0ad5f59969fc","b7b80ba0cbdf990cb1ade3ba3ff759c543f9243fa6f7a0b7be2719c8b823845e","e7d548002e3f292f4816158206db9a83a193a27872724e5135da9b771aef83f4"];
    lesson.items.forEach((item,index)=>assert.equal(createHash('sha256').update(item.feedback).digest('hex'),feedbackHashes[index]));
    assert.equal(cultureModule.lessons.length,15);
});
test('source pool starts with all ten items above empty destinations and no Next Item control',()=>{
    const {sources,nodes,lists,html}=fixture();
    assert.equal(sources.length,10);
    assert.equal(nodes.sortingCounter.textContent,'0 of 10 sorted');
    assert.equal(lists.visible.children.length+lists.hidden.children.length,0);
    assert.ok(html.indexOf('Items to Sort')<html.indexOf('Your Sorted Items'));
    assert.doesNotMatch(html,/Next Item|sortingNextItem/);
});
test('any item may be selected, and switching selection clears the previous pressed state',()=>{
    const {sources,nodes}=fixture();
    sources[8].click();assert.equal(nodes.sortingSelectedItem.textContent,lesson.items[8].text);
    assert.equal(sources[8].attrs['aria-pressed'],'true');
    assert.equal(sources[8].marker.hidden,false);
    sources[2].click();assert.equal(sources[8].attrs['aria-pressed'],'false');
    assert.equal(sources[8].marker.hidden,true);
    assert.equal(sources[2].attrs['aria-pressed'],'true');
    assert.equal(nodes.sortingSelectedItem.focused,true);
});
test('incorrect hints are direction specific and leave selection, source pool and counter unchanged',()=>{
    for(const index of [0,5]){
        const {sources,choices,nodes,lists}=fixture();sources[index].click();
        choices.find(button=>button.dataset.poolSortChoice!==lesson.items[index].answer).click();
        const text=nodes.sortingFeedback.children[0].textContent;
        assert.equal(text,index===5?'Look again. Is this something you can directly observe, or is it an underlying value, expectation, or assumption that may influence what you can see?':'Look again. Can you directly observe this behavior, practice, or expression of culture, even if its meaning may be influenced by something less visible?');
        assert.equal(sources[index].attrs['aria-pressed'],'true');
        assert.equal(sources.filter(button=>!button.removed).length,10);
        assert.equal(nodes.sortingCounter.textContent,'0 of 10 sorted');
        assert.equal(lists.visible.children.length+lists.hidden.children.length,0);
        assert.equal(text.includes(lesson.items[index].feedback),false);
    }
});
test('correct answer moves the selected item immediately, retains feedback, and cannot score twice',()=>{
    const {sources,choices,nodes,lists}=fixture();sources[2].click();choices[0].click();choices[0].click();
    assert.equal(sources[2].removed,true);
    assert.equal(sources[2].attrs['aria-pressed'],'false');
    assert.equal(lists.visible.children.length,1);
    assert.equal(lists.visible.children[0].item,lesson.items[2]);
    assert.equal(nodes.sortingCounter.textContent,'1 of 10 sorted');
    assert.equal(nodes.sortingFeedback.children[0].children[0].textContent,"That's it.");
    assert.equal(nodes.sortingFeedback.children[0].children[1].textContent,lesson.items[2].feedback);
    assert.equal(nodes.sortingFeedback.focused,true);
    assert.equal(nodes.sortingChoiceGroup.hidden,true);
    sources[8].click();assert.equal(nodes.sortingFeedback.children.length,0);
    assert.equal(nodes.sortingChoiceGroup.hidden,false);
});
test('partial progress restores order, destinations, remaining source items and counter without touching other keys',()=>{
    const saved=new Map([['response_cultureDefinition','existing answer'],['completedModules',{culture:true}]]);
    const first=fixture(saved);first.sources[7].click();first.choices[1].click();first.sources[1].click();first.choices[0].click();
    const restored=fixture(saved);
    assert.equal(restored.sources.length,8);
    assert.equal(restored.nodes.sortingCounter.textContent,'2 of 10 sorted');
    assert.equal(restored.lists.visible.children[0].item.text,'Dining practices');
    assert.equal(restored.lists.hidden.children[0].item.text,'Ideas about fairness');
    assert.equal(saved.get('response_cultureDefinition'),'existing answer');
    assert.deepEqual(saved.get('completedModules'),{culture:true});
    assert.deepEqual(Array.from(restored.sources,button=>button.item.text),lesson.items.filter((item,index)=>index!==1&&index!==7).map(item=>item.text));
});
test('completion leaves an empty source pool, five reviewable items per category and a saved completed count',()=>{
    const {sources,choices,nodes,lists,saved}=fixture();
    for(const button of [...sources].reverse()){button.click();choices.find(choice=>choice.dataset.poolSortChoice===button.item.answer).click();}
    assert.equal(sources.filter(button=>!button.removed).length,0);
    assert.equal(nodes.sortingCounter.textContent,'10 of 10 sorted');
    assert.equal(nodes.sortingCompletion.hidden,false);
    assert.equal(nodes.sortingFeedback.children[1].textContent,'All items sorted.');
    assert.equal(lists.visible.children.length,5);assert.equal(lists.hidden.children.length,5);
    const restored=fixture(saved);assert.equal(restored.sources.length,0);
    assert.equal(restored.lists.visible.children.length+restored.lists.hidden.children.length,10);
});
test('stale or malformed sorting state safely drops removed names and restores valid current items',()=>{
    const state=new Map([['sorting_culture-iceberg-sort',{order:['Public celebrations','Greetings','Greetings'],sorted:['Public celebrations','Greetings','Greetings']}]]);
    const restored=fixture(state);assert.equal(restored.sources.length,9);
    assert.equal(restored.nodes.sortingCounter.textContent,'1 of 10 sorted');
    assert.equal(restored.lists.visible.children[0].item.text,'Greetings');
    const malformed=fixture(new Map([['sorting_culture-iceberg-sort',{order:3,sorted:'bad'}]]));assert.equal(malformed.sources.length,10);
});