import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {seed,nav} from '../src/data.js';
const origin="https://h-yhj.github.io/Populus-site";
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const template=await readFile('dist/index.html','utf8');
const routes=[...nav.map(([route,label])=>({route,title:label,description:'胡杨赫俊 Populus 的个人网站：项目、思考与生活。'})),...seed.work.map(x=>({route:'/work/'+x.id,title:x.title,description:x.summary})),...seed.notes.map(x=>({route:'/notes/'+x.id,title:x.title,description:x.summary}))];
for(const {route,title,description} of routes){
 const url=origin+(route==='/'?'/':route+'/');
 const html=template.replace(/<title>.*?<\/title>/,'<title>'+escape(title+' · Populus 胡杨赫俊')+'</title>').replace(/<meta name="description" content="[^"]*" \/>/,'<meta name="description" content="'+escape(description.replace(/\n/g,' '))+'" />').replace('</head>','<link rel="canonical" href="'+url+'" /><meta property="og:title" content="'+escape(title)+'" /><meta property="og:description" content="'+escape(description)+'" /><meta property="og:url" content="'+url+'" /><meta property="og:type" content="website" /></head>');
 const dir='dist'+(route==='/'?'':route);await mkdir(dir,{recursive:true});await writeFile(dir+'/index.html',html);
}
await writeFile('dist/404.html',template.replace('content="index, follow"','content="noindex, follow"'));
await writeFile('dist/.nojekyll','');
await writeFile('dist/robots.txt','User-agent: *\nAllow: /\nSitemap: '+origin+'/sitemap.xml\n');
await writeFile('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+routes.map(x=>'<url><loc>'+origin+(x.route==='/'?'/':x.route+'/')+'</loc></url>').join('')+'</urlset>');
console.log('Prepared '+routes.length+' directly accessible pages.');
