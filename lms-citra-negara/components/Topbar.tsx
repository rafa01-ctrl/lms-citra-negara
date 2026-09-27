"use client";
import {LogOut} from 'lucide-react';
import {useRouter} from 'next/navigation';
export default function Topbar({name,role}:{name:string;role:string}){const r=useRouter();async function logout(){await fetch('/api/auth/logout',{method:'POST'});r.push('/login');r.refresh()}return <header className="topbar"><div></div><div className="top-user"><div className="avatar">{name?.[0]?.toUpperCase()}</div><div><b>{name}</b><div className="muted" style={{fontSize:12}}>{role}</div></div><button className="btn btn-ghost" onClick={logout}><LogOut size={17}/></button></div></header>}
