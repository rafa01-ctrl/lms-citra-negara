"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard,BookOpen,ClipboardList,FileText,Users,GraduationCap,School,Settings,LogOut,BarChart3,Megaphone,LibraryBig,Menu,X } from "lucide-react";
import { useState } from "react";

const menus:any={
  siswa:[['Dashboard','/',LayoutDashboard],['Materi','/siswa/materi',BookOpen],['Tugas & Proyek','/siswa/tugas',ClipboardList],['Quiz & Ujian','/siswa/quiz',FileText],['Nilai','/siswa/nilai',BarChart3],['Pengumuman','/siswa/pengumuman',Megaphone],['Profil','/siswa/profil',Users]],
  guru:[['Dashboard','/',LayoutDashboard],['Siswa & Kelas','/guru/siswa',Users],['Materi','/guru/materi',BookOpen],['Tugas','/guru/tugas',ClipboardList],['Quiz & Ujian','/guru/quiz',FileText],['Penilaian','/guru/nilai',BarChart3],['Pengumuman','/guru/pengumuman',Megaphone]],
  admin:[['Dashboard','/',LayoutDashboard],['Manajemen Siswa','/admin/siswa',Users],['Manajemen Guru','/admin/guru',GraduationCap],['Kelas','/admin/kelas',School],['Mata Pelajaran','/admin/pelajaran',LibraryBig],['Pengumuman','/admin/pengumuman',Megaphone]],
  kurikulum:[['Dashboard','/',LayoutDashboard],['Data Guru','/kurikulum/guru',Users],['Mata Pelajaran','/kurikulum/pelajaran',LibraryBig],['Monitoring Nilai','/kurikulum/nilai',BarChart3],['Pengumuman','/kurikulum/pengumuman',Megaphone]],
  kepsek:[['Dashboard','/',LayoutDashboard],['Guru','/kepsek/guru',Users],['Kelas','/kepsek/kelas',School],['Monitoring Nilai','/kepsek/nilai',BarChart3],['Laporan','/kepsek/laporan',FileText],['Pengumuman','/kepsek/pengumuman',Megaphone]],
};
export default function Sidebar({role}:{role:string}){const p=usePathname();const [open,setOpen]=useState(false);const items=menus[role]||menus.siswa;return <><button className="btn btn-ghost mobile-menu" onClick={()=>setOpen(true)}><Menu size={20}/></button><aside className={'sidebar '+(open?'open':'')}><div className="between"><div className="brand">LMS Citra Negara<small>Learning Management System</small></div><button className="btn btn-ghost" onClick={()=>setOpen(false)}><X size={18}/></button></div><nav className="nav">{items.map(([label,href,Icon]:any)=><Link key={href} className={p===href?'active':''} href={href} onClick={()=>setOpen(false)}><span className="flex"><Icon size={18}/>{label}</span></Link>)}</nav></aside></>}
