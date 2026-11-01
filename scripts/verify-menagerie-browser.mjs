import assert from "node:assert/strict";
import {chromium,webkit} from "playwright";

const root="http://127.0.0.1:3000/lab/menagerie-preview-76cf184b";
const exhibits=[["octave-spectrum",null],["octave-chassis",null],["aether","GLIDE"],["medusa","PULSE"],["atlas","UNFOLD"],["frog","HOP"]];
const environments=[
  ["Chromium desktop",chromium,{width:1440,height:900},false],
  ["Chromium mobile",chromium,{width:390,height:844},true],
  ["WebKit mobile",webkit,{width:390,height:844},true],
];
let failed=false;
for(const [name,engine,viewport,isMobile] of environments){
  let browser;
  try{
    browser=await engine.launch({headless:true,...(engine===chromium?{args:["--enable-webgl","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]}:{})});
    const context=await browser.newContext({viewport,isMobile,hasTouch:isMobile});
    const page=await context.newPage();
    const errors=[];
    page.on("pageerror",err=>errors.push(err.message));
    await page.goto(root,{waitUntil:"domcontentloaded"});
    await page.getByRole("heading",{name:/A place for/i}).waitFor();
    await page.getByRole("button",{name:"CINEMATIC LIGHT"}).click();
    assert.equal(await page.locator("main[data-lighting]").getAttribute("data-lighting"),"cinematic");
    await page.getByRole("button",{name:"STUDY LIGHT"}).click();
    assert.equal(await page.locator("main[data-lighting]").getAttribute("data-lighting"),"study");
    for(let i=0;i<exhibits.length;i++){
      const item=page.locator("button[data-selected]").nth(i);
      await item.click();
      assert.equal(await item.getAttribute("data-selected"),"true");
      await page.locator('a[href$="/exhibit/'+exhibits[i][0]+'"]').first().waitFor();
    }
    for(const [id,action] of exhibits){
      await page.goto(root+"/exhibit/"+id,{waitUntil:"domcontentloaded"});
      await page.locator("canvas").first().waitFor({state:"visible"});
      await page.locator('a[href="/lab/menagerie-preview-76cf184b"]').first().waitFor();
      if(action){
        const button=page.getByRole("button",{name:new RegExp(action)});
        await button.waitFor({state:"visible"});
        await button.click();
        await page.getByRole("button",{name:"CINEMATIC LIGHT"}).click();
        assert.equal(await page.locator("main[data-lighting]").getAttribute("data-lighting"),"cinematic");
        await page.getByRole("button",{name:"PAUSE"}).click();
        await page.getByRole("button",{name:"PLAY"}).click();
        await page.getByRole("button",{name:/RESET/}).click();
        assert.equal(await page.locator("main[data-lighting]").getAttribute("data-lighting"),"study");
      }
    }
    assert.deepEqual(errors,[],name+" page errors");
    await context.close();
    console.log("PASS",name);
  }catch(error){
    failed=true;console.error("FAIL",name,error);
  }finally{await browser?.close();}
}
if(failed)process.exitCode=1;
