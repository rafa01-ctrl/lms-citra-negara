import Sidebar from './Sidebar';
import Topbar from './Topbar';
export default function DashboardLayout({children,session}:{children:React.ReactNode;session:any}){return <div className="layout"><Sidebar role={session.role}/><main className="main"><Topbar name={session.name} role={session.role}/><section className="content">{children}</section></main></div>}
