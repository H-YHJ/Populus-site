import React,{useState} from 'react';
import {LockSimple,ArrowRight} from '@phosphor-icons/react';
import {Modal} from './App';
import {ownerRequest} from './storage';

export default function OwnerLogin({onClose,onSuccess}){
  const [password,setPassword]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
  async function submit(e){e.preventDefault();if(busy)return;setBusy(true);setError('');try{await ownerRequest('/api/owner/login',{password});setPassword('');onSuccess();}catch(e){setError(e.message);}finally{setBusy(false);}}
  return <Modal open onOpenChange={open=>!open&&!busy&&onClose()} title="站主登录" description="输入你的密码，继续整理这个小空间。" className="owner-login"><div className="owner-login-symbol"><LockSimple size={24} weight="light"/></div><form onSubmit={submit}><label className="editor-field"><span>站主密码</span><input autoFocus type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required maxLength={256} disabled={busy}/></label>{error&&<p className="editor-error" role="alert">{error}</p>}<button type="submit" className="button primary" disabled={busy||!password}>{busy?'正在验证…':'进入工作台'}<ArrowRight size={18}/></button></form><p className="editor-help">仅站主可编辑。访客可以自由浏览公开内容。</p></Modal>;
}
