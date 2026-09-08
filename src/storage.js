export const OWNER_ENABLED=false;
export async function ownerRequest(url,body){
 const response=await fetch(url,{method:body===undefined?'GET':'POST',credentials:'same-origin',headers:body===undefined?{}:{'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});
 let result;try{result=await response.json();}catch{throw new Error('编辑服务尚未启动，请稍后再试。');}
 if(!response.ok)throw new Error(result.error||'请求失败，请重试。');return result;
}
export const readLocal=key=>ownerRequest('/api/owner/content/'+key);
export const writeLocal=(key,value,expected)=>ownerRequest('/api/owner/content/'+key,{value,expected});
export const applyLocal=value=>ownerRequest('/api/owner/content/apply',{expected:value.savedAt});
// Explicit opt-in migration. Old browser data is preserved and never silently published.
export async function readLegacyDraft(){
 const available=await indexedDB.databases();if(!available.some(db=>db.name==='populus-local-preview-v1'))return null;
 const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('populus-local-preview-v1');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
 try{return await new Promise((resolve,reject)=>{const tx=db.transaction('content'),s=tx.objectStore('content');const d=s.get('draft'),c=s.get('current');tx.oncomplete=()=>resolve(d.result||c.result||null);tx.onerror=()=>reject(tx.error);});}finally{db.close();}
}
export async function imageData(file){
  if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('请选择 JPG、PNG 或 WebP 图片。');
  if(file.size>15*1024*1024)throw new Error('图片超过 15 MB，请先压缩后上传。');
  const bitmap=await createImageBitmap(file);
  try {if(bitmap.width*bitmap.height>50_000_000)throw new Error('图片像素过大，请缩小后重试。');
    const scale=Math.min(1,2000/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);return canvas.toDataURL('image/webp',0.88);
  } finally {bitmap.close();}
}
