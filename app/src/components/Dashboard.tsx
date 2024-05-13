"use client"

import { useSelector } from 'react-redux';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/app/src/store';
import { setUser } from '@/app/src/store/userSlice';
import { AddProduct } from '@/app/src/components/AddProduct';
import LoginButton from '@/app/src/components/LoginButton';

const Dashboard = () => {
    const dispatch: AppDispatch = useDispatch();
    const searchParams = useSearchParams()
    const code = searchParams!.get('code')
    useEffect(() => {
        // // Get "code" from the window location object
        // if (window === undefined) return;
        // const code = window.location.search.split('code=')[1];
        if (code) {
            dispatch(setUser({
                name: '',
                email: '',
                token: code as string
            }))
        }
    }, [code])
    return (

        <div>
            {code && code.length > 0 ? <AddProduct /> : <LoginButton />}
        </div>
    );
}

export default Dashboard;
