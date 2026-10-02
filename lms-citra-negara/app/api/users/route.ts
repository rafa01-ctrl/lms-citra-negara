import {connectDB} from '@/lib/db';import User from '@/models/User';import {hashPassword,requireRole} from '@/lib/auth';import {fail,ok} from '@/lib/api';
export async function GET(){try{await requireRole(['admin','guru','kurikulum','kepsek']);await connectDB();const users=await User.find().select('-password').populate('classId','name').sort({name:1}).lean();return ok(users)}catch{return fail('Tidak diizinkan',403)}}
export async function POST(req:Request){try{await requireRole(['admin']);const b=await req.json();if(!b.name||!b.email||!b.password||!b.role)return fail('Data user belum lengkap');await connectDB();const exists=await User.findOne({email:b.email.toLowerCase()});if(exists)return fail('Email sudah terdaftar',409);const user=await User.create({...b,email:b.email.toLowerCase(),password:await hashPassword(b.password)});return ok({id:user._id},201)}catch(e){console.error(e);return fail('Gagal membuat user',500)}}


