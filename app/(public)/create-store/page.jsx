'use client'
import { assets } from "@/assets/assets"
import { useEffect, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function CreateStore() {
    const { isSignedIn, isLoaded } = useUser()
    const router = useRouter()

    const [alreadySubmitted, setAlreadySubmitted] = useState(false)
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [logoDataUrl, setLogoDataUrl] = useState("")

    const [storeInfo, setStoreInfo] = useState({
        name: "",
        username: "",
        description: "",
        email: "",
        contact: "",
        address: "",
        image: null
    })

    const onChangeHandler = (e) => {
        setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setStoreInfo({ ...storeInfo, image: file })
            
            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setLogoDataUrl(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const fetchSellerStatus = async () => {
        if (!isLoaded) return

        if (!isSignedIn) {
            setLoading(false)
            return
        }

        try {
            const response = await fetch('/api/stores')
            const data = await response.json()

            if (response.ok && data.hasStore) {
                setAlreadySubmitted(true)
                setStatus(data.store.status)
                setMessage(
                    data.store.status === 'approved'
                        ? 'Your store has been approved! You can now start selling.'
                        : data.store.status === 'rejected'
                        ? 'Your store application was rejected. Please contact support for more information.'
                        : 'Your store application is pending approval. We will notify you once it is reviewed.'
                )
            }
        } catch (error) {
            console.error('Error fetching store status:', error)
        }

        setLoading(false)
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        if (!isSignedIn) {
            toast.error('Please sign in to create a store')
            router.push('/sign-in')
            return
        }

        // Validate required fields
        if (!storeInfo.name || !storeInfo.username || !storeInfo.description || 
            !storeInfo.email || !storeInfo.contact || !storeInfo.address) {
            toast.error('Please fill in all required fields')
            return
        }

        try {
            // Convert image to base64 if present
            let logoBase64 = ''
            if (storeInfo.image) {
                // Read file as base64
                const reader = new FileReader()
                logoBase64 = await new Promise((resolve, reject) => {
                    reader.onloadend = () => resolve(reader.result)
                    reader.onerror = reject
                    reader.readAsDataURL(storeInfo.image)
                })
            }

            const storeData = {
                name: storeInfo.name,
                username: storeInfo.username,
                description: storeInfo.description,
                email: storeInfo.email,
                contact: storeInfo.contact,
                address: storeInfo.address,
                logo: logoBase64
            }

            const response = await fetch('/api/stores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(storeData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create store')
            }

            toast.success(data.message || 'Store created successfully!')
            
            // Update UI to show pending status
            setAlreadySubmitted(true)
            setStatus('pending')
            setMessage('Your store application has been submitted. It will be activated after admin verification.')

            // Reset form
            setStoreInfo({
                name: "",
                username: "",
                description: "",
                email: "",
                contact: "",
                address: "",
                image: null
            })
            setLogoDataUrl("")

        } catch (error) {
            console.error('Error creating store:', error)
            toast.error(error.message || 'Failed to create store. Please try again.')
        }
    }

    useEffect(() => {
        if (isLoaded) {
            fetchSellerStatus()
        }
    }, [isLoaded, isSignedIn])

    return !loading ? (
        <>
            {!alreadySubmitted ? (
                <div className="mx-6 min-h-[70vh] my-16">
                    <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Submitting data..." })} className="max-w-7xl mx-auto flex flex-col items-start gap-3 text-slate-500">
                        {/* Title */}
                        <div>
                            <h1 className="text-3xl ">Add Your <span className="text-slate-800 font-medium">Store</span></h1>
                            <p className="max-w-lg">To become a seller on GoCart, submit your store details for review. Your store will be activated after admin verification.</p>
                        </div>

                        <label className="mt-10 cursor-pointer">
                            Store Logo
                            <Image src={logoDataUrl || assets.upload_area} className="rounded-lg mt-2 h-16 w-auto" alt="" width={150} height={100} />
                            <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                        </label>

                        <p>Username</p>
                        <input name="username" onChange={onChangeHandler} value={storeInfo.username} type="text" placeholder="Enter your store username" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Name</p>
                        <input name="name" onChange={onChangeHandler} value={storeInfo.name} type="text" placeholder="Enter your store name" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Description</p>
                        <textarea name="description" onChange={onChangeHandler} value={storeInfo.description} rows={5} placeholder="Enter your store description" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none" />

                        <p>Email</p>
                        <input name="email" onChange={onChangeHandler} value={storeInfo.email} type="email" placeholder="Enter your store email" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Contact Number</p>
                        <input name="contact" onChange={onChangeHandler} value={storeInfo.contact} type="text" placeholder="Enter your store contact number" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Address</p>
                        <textarea name="address" onChange={onChangeHandler} value={storeInfo.address} rows={5} placeholder="Enter your store address" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none" />

                        <button className="bg-slate-800 text-white px-12 py-2 rounded mt-10 mb-40 active:scale-95 hover:bg-slate-900 transition ">Submit</button>
                    </form>
                </div>
            ) : (
                <div className="min-h-[80vh] flex flex-col items-center justify-center">
                    <p className="sm:text-2xl lg:text-3xl mx-5 font-semibold text-slate-500 text-center max-w-2xl">{message}</p>
                    {status === "approved" && <p className="mt-5 text-slate-400">redirecting to dashboard in <span className="font-semibold">5 seconds</span></p>}
                </div>
            )}
        </>
    ) : (<Loading />)
}