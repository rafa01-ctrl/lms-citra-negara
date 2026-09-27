import {getSession,currentUser} from '@/lib/auth';import {ok,fail} from '@/lib/api';
export async function GET(){const s=await getSession();if(!s)return fail('Belum login',401);const u=await currentUser();return ok({session:s,user:u})}
