import {redirect} from 'next/navigation';import {getSession} from '@/lib/auth';import DashboardLayout from '@/components/DashboardLayout';
export default async function Layout({children}:{children:React.ReactNode}){const session=await getSession();if(!session)redirect('/login');return <DashboardLayout session={session}>{children}</DashboardLayout>}
