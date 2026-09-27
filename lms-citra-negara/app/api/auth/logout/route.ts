import {cookies} from 'next/headers';import {ok} from '@/lib/api';
export async function POST(){(await cookies()).delete('lms_session');return ok({success:true})}
