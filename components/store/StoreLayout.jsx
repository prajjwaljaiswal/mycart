'use client'
import { useEffect, useState } from "react"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import SellerNavbar from "./StoreNavbar"
import SellerSidebar from "./StoreSidebar"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

const StoreLayout = ({ children }) => {
    const { isSignedIn, isLoaded, user } = useUser()
    const router = useRouter()
    const [isSeller, setIsSeller] = useState(false)
    const [loading, setLoading] = useState(true)
    const [storeInfo, setStoreInfo] = useState(null)

    const fetchIsSeller = async () => {
        if (!isLoaded) return

        if (!isSignedIn) {
            router.push('/sign-in')
            return
        }

        try {
            // Check if user has an approved store
            const response = await fetch('/api/stores')
            const data = await response.json()

            if (response.ok && data.hasStore) {
                const store = data.store
                
                // Check if store is approved and active
                if (store.status === 'approved' && store.isActive) {
                    setIsSeller(true)
                    setStoreInfo(store)
                } else {
                    // Store not approved yet
                    setIsSeller(false)
                }
            } else {
                // No store found - redirect to create store
                setIsSeller(false)
            }
        } catch (error) {
            console.error('Error checking store status:', error)
            setIsSeller(false)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchIsSeller()
    }, [isLoaded, isSignedIn, router])

    if (!isLoaded || loading) {
        return <Loading />
    }

    if (!isSignedIn) {
        return null // Will redirect to sign-in
    }

    if (!isSeller) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">Store Access Required</h1>
                <p className="mt-4 text-slate-500">
                    {storeInfo 
                        ? 'Your store is pending approval. Please wait for admin verification.'
                        : 'You need to create a store first to access this area.'
                    }
                </p>
                <Link 
                    href="/create-store" 
                    className="bg-slate-700 text-white flex items-center gap-2 mt-8 p-2 px-6 max-sm:text-sm rounded-full"
                >
                    {storeInfo ? 'View Store Status' : 'Create Store'} <ArrowRightIcon size={18} />
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen">
            <SellerNavbar />
            <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
                <SellerSidebar storeInfo={storeInfo} />
                <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default StoreLayout