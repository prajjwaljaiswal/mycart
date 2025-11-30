'use client'
import { useEffect, useState } from "react"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import AdminNavbar from "./AdminNavbar"
import AdminSidebar from "./AdminSidebar"
import { useRouter } from "next/navigation"

const AdminLayout = ({ children }) => {
    const router = useRouter()
    const [isAdmin, setIsAdmin] = useState(false)
    const [adminInfo, setAdminInfo] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchAdminStatus = async () => {
        try {
            const response = await fetch('/api/admin/auth/check')
            const data = await response.json()

            if (response.ok && data.isAdmin) {
                setIsAdmin(true)
                setAdminInfo(data.admin)
            } else {
                setIsAdmin(false)
                router.push('/admin/login')
            }
        } catch (error) {
            console.error('Error checking admin status:', error)
            setIsAdmin(false)
            router.push('/admin/login')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAdminStatus()
    }, [router])

    if (loading) {
        return <Loading />
    }

    if (!isAdmin) {
        return null // Will redirect to login
    }

    return (
        <div className="flex flex-col h-screen">
            <AdminNavbar adminInfo={adminInfo} />
            <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
                <AdminSidebar />
                <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AdminLayout
