import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {courseData} from '../js/courseData.js';
import * as storage from '../js/storage.js';
import {getMissingRequiredResponses,getReflectionEntries,saveResponseDrafts,hasResponse} from '../js/reflectionValidation.js';

function controllerFixture(saved=new Map()) {
    globalThis.localStorage={getItem:key=>saved.get(key)??null,setItem:(key,value)=>saved.set(key,value)};
    const source=readFileSync(new URL('../js/app.js',import.meta.url),'utf8').replace(/^import[\s\S]*?;\s*$/gm,'').replace(/\ninitApp\(\);\s*$/,'');
    const visits=[],boundaries=[];
    const context={courseData,...storage,getMissingRequiredResponses,saveResponseDrafts:()=>{},validateRequiredFields:()=>true,
        renderLesson:lesson=>visits.push(lesson.id),console,window:{scrollTo(){}},visits,boundaries};
    vm.createContext(context);
    vm.runInContext(source+`;updateSidebar=()=>{};showIncompleteReflections=module=>boundaries.push(getMissingRequiredResponses(module).map(entry=>entry.storageKey));globalThis.api={goToLesson,goToModule,completeModule,isWorkshopComplete,state:appState};`,context);
    return {api:context.api,visits,boundaries,saved};
}

test('module guard allows current-module navigation, blocks sidebar and menu/reload bypass, and allows backward travel',()=>{
    const {api,visits,boundaries}=controllerFixture();
    const culture=courseData.modules[0],stereotypes=courseData.modules[1];
    api.goToModule(culture.key);
    api.goToLesson(culture.lessons[2].id);
    assert.equal(visits.at(-1),culture.lessons[2].id);
    api.goToModule(stereotypes.key);
    assert.equal(visits.at(-1),culture.lessons[2].id);
    assert.equal(boundaries.at(-1).length,5);
    api.state.currentLessonId=null;
    api.goToModule(stereotypes.key);
    assert.equal(visits.at(-1),culture.lessons[2].id);
    assert.equal(storage.loadItem('activeModuleKey'),culture.key);
    for(const entry of culture.lessons.flatMap(getReflectionEntries).filter(entry=>entry.required))storage.saveResponse(entry.storageKey,'a');
    api.goToModule(stereotypes.key);
    assert.equal(visits.at(-1),stereotypes.lessons[0].id);
    api.goToLesson(culture.lessons.at(-1).id);
    assert.equal(visits.at(-1),culture.lessons.at(-1).id);
});

test('all missing reflections are listed and saved text removes entries without completion flags',()=>{
    const {api,boundaries}=controllerFixture();
    const module=courseData.modules[0];
    const entries=module.lessons.flatMap(getReflectionEntries).filter(entry=>entry.required);
    assert.equal(api.completeModule(module.key),false);
    assert.equal(boundaries.at(-1).length,entries.length);
    storage.saveResponse(entries[0].storageKey,'partial draft');
    storage.saveResponse(entries[1].storageKey,' \n\t');
    assert.equal(api.completeModule(module.key),false);
    assert.equal(boundaries.at(-1).length,entries.length-1);
    assert.equal(storage.loadCompletedModules()[module.key],undefined);
    for(const entry of entries)storage.saveResponse(entry.storageKey,'I would ask for more information.');
    assert.equal(api.completeModule(module.key),true);
    assert.equal(storage.loadCompletedModules()[module.key],true);
    assert.equal(api.isWorkshopComplete(),false);
});

test('skip preserves both partial and whitespace drafts using existing response storage',()=>{
    controllerFixture();
    const fields=[{dataset:{storageKey:'draft'},value:'partial draft'},{dataset:{guidedStorageKey:'spaces'},value:' \n\t'}];
    saveResponseDrafts({querySelectorAll:()=>fields});
    assert.equal(storage.loadResponse('draft'),'partial draft');
    assert.equal(storage.loadResponse('spaces'),' \n\t');
    assert.equal(hasResponse(storage.loadResponse('draft')),true);
    assert.equal(hasResponse(storage.loadResponse('spaces')),false);
});

test('Next and Skip are distinct, while Previous never invokes validation',()=>{
    const listeners={};
    const control=name=>({addEventListener:(event,callback)=>{listeners[name]=callback;}});
    const controls={"[data-action='next']":[control('next')],"[data-action='skip']":[control('skip')],"[data-action='previous']":[control('previous')]};
    const document={querySelectorAll:selector=>controls[selector]||[]};
    let validations=0,drafts=0;
    const visits=[];
    const source=readFileSync(new URL('../js/renderer.js',import.meta.url),'utf8').replace(/^import[\s\S]*?;\s*$/gm,'').replace(/export function /g,'function ');
    const context={document,initializeResponseValidation(){},validateRequiredFields(){validations++;return false;},saveResponseDrafts(){drafts++;}};
    vm.createContext(context);
    vm.runInContext(source+';globalThis.attach=attachSharedLessonEvents;',context);
    context.attach({type:'reflection'},{previousLesson:{id:'back'},nextLesson:{id:'forward'},goToLesson:id=>visits.push(id)});
    listeners.next();assert.equal(validations,1);assert.deepEqual(visits,[]);
    listeners.skip();assert.equal(drafts,1);assert.deepEqual(visits,['forward']);
    listeners.previous();assert.equal(validations,1);assert.deepEqual(visits,['forward','back']);
});

test('guided reflections support explicit skip without letting outer Next silently bypass later slides',()=>{
    const nodes=Object.fromEntries(['guidedSlideContainer','guidedPrevious','guidedNext','guidedProgress','guidedSkip'].map(id=>[id,{listeners:{},addEventListener(type,callback){this.listeners[type]=callback;},querySelectorAll(){return [];}}]));
    const outerSkip={};
    const document={getElementById:id=>nodes[id],querySelectorAll:selector=>selector==="[data-action='skip']"?[outerSkip]:[]};
    const source=readFileSync(new URL('../js/activities.js',import.meta.url),'utf8').replace(/^import[\s\S]*?;\s*$/gm,'').replace(/export function /g,'function ');
    let validationCalls=0,drafts=0;
    const visits=[];
    const context={document,saveResponseDrafts(){drafts++;},validateRequiredFields(){validationCalls++;return false;},updateNavigationOrder(){}};
    vm.createContext(context);
    vm.runInContext(source+`;renderGuidedSlide=slide=>slide.title;attachGuidedSlideEvents=()=>{};globalThis.initialize=initializeGuidedActivity;`,context);
    const lesson={type:'guidedActivity',slides:[{title:'Before',slideType:'story'},{title:'Reflection',slideType:'reflection',storageKey:'draft',required:true},{title:'After',slideType:'story'}]};
    const navigation={nextLesson:{id:'next-page'},goToLesson:id=>visits.push(id)};
    context.initialize(lesson,navigation);
    navigation.advanceGuidedActivity(true);
    assert.equal(nodes.guidedSlideContainer.innerHTML,'Reflection');
    assert.equal(outerSkip.hidden,false);
    navigation.advanceGuidedActivity(false);
    assert.equal(nodes.guidedSlideContainer.innerHTML,'Reflection');
    assert.equal(validationCalls,1);
    nodes.guidedSkip.listeners.click();
    assert.equal(nodes.guidedSlideContainer.innerHTML,'After');
    assert.equal(outerSkip.hidden,true);
    assert.deepEqual(visits,[]);
    assert.equal(drafts,3);
});

test('responsive navigation follows the same DOM and visual order and restores desktop controls',()=>{
    const buttons=['Previous','Return to Menu','Next','Skip for Now'].map(text=>({text,matches(selector){return (text==='Next'&&selector.includes('[data-action="next"]'))||(text==='Skip for Now'&&selector.includes('[data-action="skip"]'));}}));
    const region={children:[...buttons],contains(){return false;},appendChild(child){this.children.splice(this.children.indexOf(child),1);this.children.push(child);}};
    const media={matches:true,addEventListener(type,callback){this.callback=callback;}};
    const source=readFileSync(new URL('../js/responsiveNavigation.js',import.meta.url),'utf8').replace('export function','function');
    const context={window:{matchMedia:()=>media},document:{querySelectorAll:()=>[region],activeElement:null}};
    vm.createContext(context);
    vm.runInContext(source+';globalThis.update=updateNavigationOrder;',context);
    context.update();
    assert.deepEqual(region.children.map(button=>button.text),['Next','Skip for Now','Previous','Return to Menu']);
    media.matches=false;media.callback();
    assert.deepEqual(region.children.map(button=>button.text),['Previous','Return to Menu','Next','Skip for Now']);
});

test('Reflection Summary retains its special navigation without Next or Skip',()=>{
    const source=readFileSync(new URL('../js/renderer.js',import.meta.url),'utf8').replace(/^import[\s\S]*?;\s*$/gm,'').replace(/export function /g,'function ');
    const context={getReflectionEntries};
    vm.createContext(context);
    vm.runInContext(source+';globalThis.navigation=renderLessonNavigation;',context);
    const html=context.navigation({currentLesson:{type:'reflectionSummary'},previousLesson:{id:'last'},nextLesson:null});
    assert.doesNotMatch(html,/data-action="next"|data-action="skip"/);
    assert.match(html,/data-action="previous"/);
});

test('unfinished-module navigation state persists across menu visits and reloads without erasing responses',()=>{
    const first=controllerFixture();
    const culture=courseData.modules[0];
    first.api.goToModule(culture.key);
    storage.saveResponse('cultureDefinition','existing answer');
    first.api.state.currentLessonId=null;
    storage.saveCurrentLesson(null);
    const reloaded=controllerFixture(first.saved);
    reloaded.api.goToModule(courseData.modules[1].key);
    assert.equal(reloaded.visits.length,0);
    assert.equal(reloaded.boundaries.at(-1).length,4);
    assert.equal(storage.loadResponse('cultureDefinition'),'existing answer');
});

test('backward review cannot lose an unfinished module or bypass it through the menu',()=>{
    const {api,boundaries}=controllerFixture();
    const [culture,stereotypes,ambiguity]=courseData.modules;
    const required=culture.lessons.flatMap(getReflectionEntries).filter(entry=>entry.required);
    for(const entry of required)storage.saveResponse(entry.storageKey,'existing answer');
    api.goToModule(culture.key);
    api.goToModule(stereotypes.key);
    api.goToModule(culture.key);
    storage.saveResponse(required[0].storageKey,'');
    api.state.currentLessonId=null;
    api.goToModule(ambiguity.key);
    assert.equal(boundaries.at(-1)[0],required[0].storageKey);
    storage.saveResponse(required[0].storageKey,'a');
    api.goToModule(ambiguity.key);
    assert.equal(boundaries.at(-1).length,2);
    assert.equal(boundaries.at(-1)[0],'stereotypesReflection');
});
