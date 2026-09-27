"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard,BookOpen,ClipboardList,FileText,Users,GraduationCap,School,Settings,LogOut,BarChart3,Megaphone,LibraryBig,Menu,X } from "lucide-react";
import { useState } from "react";

const menus:any={
 siswa:[['Dashboard','/dashboard',LayoutDashboard],['Materi','/dashboard/siswa/materi',BookOpen],['Tugas & Proyek','/dashboard/siswa/tugas',ClipboardList],['Quiz & Ujian','/dashboard/siswa/quiz',FileText],['Nilai','/dashboard/siswa/nilai',BarChart3],['Pengumuman','/dashboard/siswa/pengumuman',Megaphone],['Profil','/dashboard/siswa/profil',Users]],
 guru:[['Dashboard','/dashboard',LayoutDashboard],['Siswa & Kelas','/dashboard/guru/siswa',Users],['Materi','/dashboard/guru/materi',BookOpen],['Tugas','/dashboard/guru/tugas',ClipboardList],['Quiz & Ujian','/dashboard/guru/quiz',FileText],['Penilaian','/dashboard/guru/nilai',BarChart3],['Pengumuman','/dashboard/guru/pengumuman',Megaphone]],
 admin:[['Dashboard','/dashboard',LayoutDashboard],['Manajemen Siswa','/dashboard/admin/siswa',Users],['Manajemen Guru','/dashboard/admin/guru',GraduationCap],['Kelas','/dashboard/admin/kelas',School],['Mata Pelajaran','/dashboard/admin/pelajaran',LibraryBig],['Pengumuman','/dashboard/admin/pengumuman',Megaphone]],
 kurikulum:[['Dashboard','/dashboard',LayoutDashboard],['Data Guru','/dashboard/kurikulum/guru',Users],['Mata Pelajaran','/dashboard/kurikulum/pelajaran',LibraryBig],['Monitoring Nilai','/dashboard/kurikulum/nilai',BarChart3],['Pengumuman','/dashboard/kurikulum/pengumuman',Megaphone]],
 kepsek:[['Dashboard','/dashboard',LayoutDashboard],['Guru','/dashboard/kepsek/guru',Users],['Kelas','/dashboard/kepsek/kelas',School],['Monitoring Nilai','/dashboard/kepsek/nilai',BarChart3],['Laporan','/dashboard/kepsek/laporan',FileText],['Pengumuman','/dashboard/kepsek/pengumuman',Megaphone]],
};
export default function Sidebar({role}:{role:string}){const p=usePathname();const [open,setOpen]=useState(false);const items=menus[role]||menus.siswa;return <><button className="btn btn-ghost mobile-menu" onClick={()=>setOpen(true)}><Menu size={20}/></button><aside className={'sidebar '+(open?'open':'')}><div className="between"><div className="brand">LMS Citra Negara<small>Learning Management System</small></div><button className="btn btn-ghost" onClick={()=>setOpen(false)}><X size={18}/></button></div><nav className="nav">{items.map(([label,href,Icon]:any)=><Link key={href} className={p===href?'active':''} href={href} onClick={()=>setOpen(false)}><span className="flex"><Icon size={18}/>{label}</span></Link>)}</nav></aside></>}
