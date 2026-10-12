import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { createServer, loadConfigFromFile } from 'vite';
test('GET confirmation links open HTML; POST confirmation reaches the API', async () => {
  const received=[];
  const backend=http.createServer((req,res)=>{ received.push({method:req.method,url:req.url}); res.setHeader('Content-Type','application/json'); res.end(JSON.stringify({message:'Email confirmado'})); });
  await new Promise(resolve=>backend.listen(0,'127.0.0.1',resolve));
  let vite;
  try {
    const root=fileURLToPath(new URL('../',import.meta.url));
    const {config}=await loadConfigFromFile({command:'serve',mode:'development'},root+'vite.config.ts',root);
    config.server.proxy['/v1'].target='http://127.0.0.1:'+backend.address().port;
    vite=await createServer({...config,root,configFile:false,server:{...config.server,host:'127.0.0.1',port:0,open:false},logLevel:'silent'});
    await vite.listen();
    const base='http://127.0.0.1:'+vite.httpServer.address().port;
    for (const path of ['/v1/user/confirm-email','/v1/confirm-email','/v1/user/verify-email']) {
      const response=await fetch(base+path+'?token=test-token');
      assert.equal(response.status,200);
      assert.match(response.headers.get('content-type'),/text\/html/);
      assert.match(await response.text(),/src\/main.tsx/);
    }
    assert.deepEqual(received,[]);
    const response=await fetch(base+'/v1/user/confirm-email?token=test-token',{method:'POST'});
    assert.equal(response.status,200);
    assert.equal((await response.json()).message,'Email confirmado');
    assert.deepEqual(received,[{method:'POST',url:'/v1/user/confirm-email?token=test-token'}]);
  } finally {
    if(vite) await vite.close();
    await new Promise(resolve=>backend.close(resolve));
  }
});
