import React, {useEffect, useRef, useState} from 'react';
import {useReducedMotion} from 'motion/react';
import './discovery-cards.css';

const stories = [
  {id:'stage', title:'话筒前的我', label:'舞台 / HOST', text:'从讲稿到现场，在霍格沃茨之夜担任主持，把每一个环节串联起来。', to:'/work/stage-and-connection', link:'走进舞台背后'},
  {id:'anniversary-bamboo', title:'换一种出场方式', label:'走秀 / MODEL', text:'在厚含书院一周年与二周年庆走秀活动中担任模特，尝试另一种舞台表达。', to:'/work/campus-activities', link:'看看校园活动'},
  {id:'beach-sunset', title:'等一场日落', label:'旅行 / SUNSET', text:'走到海边，把脚步放慢，也把这一刻的光留在照片里。', to:'/life', link:'翻翻生活相册'},
  {id:'campus-esports', title:'和队友一起上场', label:'兴趣 / TEAMPLAY', text:'和「南北绿豆」的队友一起，拿下高校 5v5 深圳港中深站亚军。', to:'/life', link:'看看我的兴趣', contain:true},
  {id:'childhood', title:'故事更早的一页', label:'成长 / LITTLE ME', text:'小时候的我，坐在钢琴旁。把这一页也放进来，认识一下更早的我。', to:'/about', link:'继续认识我', position:'65% center'},
  {id:'personal-camera', title:'镜头后面的我', label:'记录 / THROUGH MY LENS', text:'旅行时也喜欢拿起相机，记录眼前的建筑、光线和生活片段。', to:'/work/content-operations', link:'看看我的内容实践'},
];

export default function DiscoveryCards({data, Link}) {
  const available = stories.flatMap(s => {const photo=data.photos.find(p=>p.id===s.id&&p.visible);return photo?[{...s,photo}]:[];});
  const [phase,setPhase]=useState('ready');
  const [selected,setSelected]=useState(null);
  const [result,setResult]=useState(null);
  const [seen,setSeen]=useState([]);
  const [instant,setInstant]=useState(false);
  const busy=useRef(false), timers=useRef([]), redraw=useRef(null), cards=useRef([]);
  const reduce=useReducedMotion();
  useEffect(()=>()=>timers.current.forEach(clearTimeout),[]);
  useEffect(()=>{if(phase==='revealed')redraw.current?.focus({preventScroll:true});},[phase]);
  const later=(fn,ms)=>timers.current.push(setTimeout(fn,ms));
  function draw(index,event) {
    if(busy.current||phase!=='ready'||!available.length)return;
    busy.current=true;
    const remaining=available.filter(s=>!seen.includes(s.id));
    const pool=remaining.length?remaining:available;
    const story=pool[Math.floor(Math.random()*pool.length)];
    const noMotion=reduce||event.detail===0;
    setInstant(noMotion);setResult(story);setSelected(index);
    setSeen(previous=>remaining.length?[...previous,story.id]:[story.id]);
    setPhase(noMotion?'revealed':'gathering');
    const finish=()=>{setPhase('revealed');busy.current=false;};
    if(noMotion)later(finish,0);
    else {later(()=>setPhase('flipping'),240);later(finish,800);}
  }
  function reset(event) {
    if(busy.current)return;
    busy.current=true;
    const noMotion=reduce||event.detail===0;
    setInstant(noMotion);setPhase('resetting');
    const finish=()=>{setSelected(null);setResult(null);setPhase('ready');busy.current=false;later(()=>cards.current[1]?.focus({preventScroll:true}),0);};
    later(finish,noMotion?0:240);
  }
  if(!available.length)return null;
  const revealed=phase==='revealed';
  return <section className={`discovery-section ${instant?'discovery-instant':''}`} id="discover" aria-labelledby="discovery-heading" data-phase={phase}>
    <div className="discovery-copy">
      <p className="eyebrow">A LITTLE SURPRISE / POPULUS</p>
      <h2 id="discovery-heading">抽一张，<br/>认识另一面的我。</h2>
      <div className="discovery-detail" aria-live="polite" aria-atomic="true">
        {revealed&&result?<><p className="discovery-category">{result.label}</p><h3>{result.title}</h3><p>{result.text}</p></>:<p className="discovery-instruction">{phase==='ready'?'选一张树下的卡片，打开一段我的故事。':'一段故事，正在展开。'}</p>}
      </div>
      <div className="discovery-actions">
        <button ref={redraw} type="button" className="discovery-again" disabled={!revealed} onClick={reset}>{seen.length>=available.length?'再来一轮':'再抽一张'} <span aria-hidden="true">↻</span></button>
        {revealed&&result&&<Link to={result.to} className="text-link">{result.link}<span aria-hidden="true">→</span></Link>}
      </div>
      <p className="discovery-count">{seen.length?`已发现 ${seen.length} / ${available.length} 个片段`:`${available.length} 个片段，随机遇见`}</p>
    </div>
    <div className="discovery-deck" role="group" aria-label="选择一张故事卡牌">
      <div className="discovery-halo" aria-hidden="true"/>
      {[0,1,2].map(index=>{
        const chosen=selected===index;
        return <button type="button" key={index} ref={node=>cards.current[index]=node} className={`discovery-card discovery-card-${index} ${chosen?'is-chosen':''} ${selected!==null&&!chosen?'is-muted':''}`} aria-label={chosen&&revealed?`已揭晓：${result.title}`:`抽取第 ${index+1} 张故事卡牌`} aria-disabled={phase!=='ready'} tabIndex={phase==='ready'?0:-1} onClick={event=>draw(index,event)}>
          <span className="discovery-card-turn">
            <span className="discovery-back" aria-hidden="true"><span className="discovery-card-top">POPULUS</span><span className="discovery-orbit"><span className="discovery-tree">🌳</span></span><span className="discovery-spark">✦</span><span className="discovery-card-bottom">每一面，都在生长</span></span>
            <span className={`discovery-front ${result?.contain?'discovery-front-contain':''}`} aria-hidden="true">{chosen&&result&&<><img src={result.photo.src} alt="" style={{objectPosition:result.position||'center 30%'}}/><span className="discovery-front-title"><small>{result.label}</small><strong>{result.title}</strong></span></>}</span>
          </span>
        </button>;
      })}
      <p className="discovery-deck-hint" aria-hidden="true">{phase==='ready'?'轻触一张 · 揭晓故事':revealed?'这一张，是我的一个侧面':'✦'}</p>
    </div>
  </section>;
}
