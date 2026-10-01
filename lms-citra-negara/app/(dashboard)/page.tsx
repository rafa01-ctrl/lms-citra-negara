import {redirect} from 'next/navigation';import {getSession} from '@/lib/auth';import AdminDashboard from '@/components/AdminDashboard';import DashboardHome from '@/components/DashboardHome';
export default async function Page(){const s=await getSession();if(!s)redirect('/login');return s.role==='admin'?<AdminDashboard session={s}/>:<DashboardHome session={s}/>}
