import {connectDB} from '@/lib/db';import Class from '@/models/Class';import {requireRole} from '@/lib/auth';import {fail,ok} from '@/lib/api';
export async function GET(){try{await requireRole(['admin','guru','kurikulum','kepsek','siswa']);await connectDB();return ok(await Class.find().populate('homeroomTeacherId','name').sort({name:1}).lean())}catch{return fail('Tidak diizinkan',403)}}
export async function POST(req:Request){try{await requireRole(['admin']);await connectDB();const b=await req.json();return ok(await Class.create(b),201)}catch{return fail('Gagal membuat kelas',500)}}
