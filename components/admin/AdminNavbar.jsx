'use client'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

const AdminNavbar = ({ adminInfo }) => {
    const router = useRouter()
    const [loggingOut, setLoggingOut] = useState(false)

    const handleLogout = async () => {
        setLoggingOut(true)
        try {
            const response = await fetch('/api/admin/auth/logout', {
                method: 'POST'
            })

            if (response.ok) {
                toast.success('Logged out successfully')
                router.push('/admin/login')
                router.refresh()
            }
        } catch (error) {
            console.error('Logout error:', error)
            toast.error('Failed to logout')
            setLoggingOut(false)
        }
    }

    return (
        <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all">
            <Link href="/admin" className="relative text-4xl font-semibold text-slate-700">
                <span className="text-green-600">go</span>cart<span className="text-green-600 text-5xl leading-0">.</span>
                <p className="absolute text-xs font-semibold -top-1 -right-13 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                    Admin
                </p>
            </Link>
            <div className="flex items-center gap-3">
                {adminInfo && (
                    <>
                        <p className="text-slate-600">Hi, {adminInfo.name || adminInfo.email}</p>
                        <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 transition text-sm"
                        >
                            {loggingOut ? 'Logging out...' : 'Logout'}
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default AdminNavbar