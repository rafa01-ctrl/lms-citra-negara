import {getSession} from '@/lib/auth';import DashboardHome from '@/components/DashboardHome';
export default async function Page(){const s=await getSession();return <DashboardHome session={s!}/>}
