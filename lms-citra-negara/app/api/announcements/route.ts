import {connectDB} from '@/lib/db';import Announcement from '@/models/Announcement';import {requireRole} from '@/lib/auth';import {fail,ok} from '@/lib/api';
export async function GET(){try{const s=await requireRole(['admin','guru','kurikulum','kepsek','siswa']);await connectDB();const q:any={};if(s.role==='siswa')q.$or=[{targetRoles:'siswa'},{targetRoles:{$exists:false}}];return ok(await Announcement.find(q).populate('authorId','name').sort({createdAt:-1}).lean())}catch{return fail('Tidak diizinkan',403)}}
export async function POST(req:Request){try{const s=await requireRole(['admin','guru','kurikulum','kepsek']);await connectDB();const b=await req.json();if(!b.title||!b.content)return fail('Judul dan isi wajib diisi');const targetRoles=String(b.targetRoles??'').split(',').map((s:string)=>s.trim()).filter(Boolean);return ok(await Announcement.create({title:b.title,content:b.content,targetRoles,authorId:s.id}),201)}catch{return fail('Gagal membuat pengumuman',500)}}


