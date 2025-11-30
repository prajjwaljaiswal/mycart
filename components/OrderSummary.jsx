import { PlusIcon, SquarePenIcon, XIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import AddressModal from './AddressModal';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { clearCart } from '@/lib/features/cart/cartSlice';
import { setAddresses } from '@/lib/features/address/addressSlice';

const OrderSummary = ({ totalPrice, items }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const router = useRouter();
    const dispatch = useDispatch();
    const { isSignedIn } = useUser();

    const addressList = useSelector(state => state.address.list);

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [coupon, setCoupon] = useState('');

    // Fetch addresses from API when component mounts and user is signed in
    useEffect(() => {
        const fetchAddresses = async () => {
            if (!isSignedIn) return;

            try {
                const response = await fetch('/api/addresses');
                const data = await response.json();

                if (response.ok && data.addresses) {
                    dispatch(setAddresses(data.addresses));
                }
            } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        };

        fetchAddresses();
    }, [isSignedIn, dispatch]);

    // Reload addresses when modal closes (in case a new one was added)
    useEffect(() => {
        if (!showAddressModal && isSignedIn) {
            const fetchAddresses = async () => {
                try {
                    const response = await fetch('/api/addresses');
                    const data = await response.json();

                    if (response.ok && data.addresses) {
                        dispatch(setAddresses(data.addresses));
                    }
                } catch (error) {
                    console.error('Error fetching addresses:', error);
                }
            };

            fetchAddresses();
        }
    }, [showAddressModal, isSignedIn, dispatch]);

    const handleCouponCode = async (event) => {
        event.preventDefault();
        
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        // Validate user is signed in
        if (!isSignedIn) {
            toast.error('Please sign in to place an order');
            return;
        }

        // Validate address is selected
        if (!selectedAddress || !selectedAddress.id) {
            toast.error('Please select a delivery address');
            return;
        }

        // Validate items
        if (!items || items.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        try {
            // Prepare order data
            const orderData = {
                items: items.map(item => ({
                    id: item.id,
                    storeId: item.storeId,
                    price: item.price,
                    quantity: item.quantity
                })),
                addressId: selectedAddress.id,
                paymentMethod: paymentMethod,
                coupon: coupon || null,
                total: coupon 
                    ? totalPrice - (coupon.discount / 100 * totalPrice)
                    : totalPrice
            };

            // Call API to place order
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to place order');
            }

            // Clear cart on success
            dispatch(clearCart());

            // Show success message
            toast.success('Order placed successfully!');

            // Redirect to orders page
            router.push('/orders');

        } catch (error) {
            console.error('Error placing order:', error);
            toast.error(error.message || 'Failed to place order. Please try again.');
        }
    }

    return (
        <div className='w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7'>
            <h2 className='text-xl font-medium text-slate-600'>Payment Summary</h2>
            <p className='text-slate-400 text-xs my-4'>Payment Method</p>
            <div className='flex gap-2 items-center'>
                <input type="radio" id="COD" onChange={() => setPaymentMethod('COD')} checked={paymentMethod === 'COD'} className='accent-gray-500' />
                <label htmlFor="COD" className='cursor-pointer'>COD</label>
            </div>
            <div className='flex gap-2 items-center mt-1'>
                <input type="radio" id="STRIPE" name='payment' onChange={() => setPaymentMethod('STRIPE')} checked={paymentMethod === 'STRIPE'} className='accent-gray-500' />
                <label htmlFor="STRIPE" className='cursor-pointer'>Stripe Payment</label>
            </div>
            <div className='my-4 py-4 border-y border-slate-200 text-slate-400'>
                <p>Address</p>
                {
                    selectedAddress ? (
                        <div className='flex gap-2 items-center'>
                            <p>{selectedAddress.name}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.zip}</p>
                            <SquarePenIcon onClick={() => setSelectedAddress(null)} className='cursor-pointer' size={18} />
                        </div>
                    ) : (
                        <div>
                            {
                                addressList.length > 0 && (
                                    <select className='border border-slate-400 p-2 w-full my-3 outline-none rounded' onChange={(e) => {
                                        const addressId = e.target.value;
                                        const address = addressList.find(addr => addr.id === addressId);
                                        setSelectedAddress(address || null);
                                    }} >
                                        <option value="">Select Address</option>
                                        {
                                            addressList.map((address) => (
                                                <option key={address.id} value={address.id}>{address.name}, {address.city}, {address.state}, {address.zip}</option>
                                            ))
                                        }
                                    </select>
                                )
                            }
                            <button className='flex items-center gap-1 text-slate-600 mt-1' onClick={() => setShowAddressModal(true)} >Add Address <PlusIcon size={18} /></button>
                        </div>
                    )
                }
            </div>
            <div className='pb-4 border-b border-slate-200'>
                <div className='flex justify-between'>
                    <div className='flex flex-col gap-1 text-slate-400'>
                        <p>Subtotal:</p>
                        <p>Shipping:</p>
                        {coupon && <p>Coupon:</p>}
                    </div>
                    <div className='flex flex-col gap-1 font-medium text-right'>
                        <p>{currency}{totalPrice.toLocaleString()}</p>
                        <p>Free</p>
                        {coupon && <p>{`-${currency}${(coupon.discount / 100 * totalPrice).toFixed(2)}`}</p>}
                    </div>
                </div>
                {
                    !coupon ? (
                        <form onSubmit={e => toast.promise(handleCouponCode(e), { loading: 'Checking Coupon...' })} className='flex justify-center gap-3 mt-3'>
                            <input onChange={(e) => setCouponCodeInput(e.target.value)} value={couponCodeInput} type="text" placeholder='Coupon Code' className='border border-slate-400 p-1.5 rounded w-full outline-none' />
                            <button className='bg-slate-600 text-white px-3 rounded hover:bg-slate-800 active:scale-95 transition-all'>Apply</button>
                        </form>
                    ) : (
                        <div className='w-full flex items-center justify-center gap-2 text-xs mt-2'>
                            <p>Code: <span className='font-semibold ml-1'>{coupon.code.toUpperCase()}</span></p>
                            <p>{coupon.description}</p>
                            <XIcon size={18} onClick={() => setCoupon('')} className='hover:text-red-700 transition cursor-pointer' />
                        </div>
                    )
                }
            </div>
            <div className='flex justify-between py-4'>
                <p>Total:</p>
                <p className='font-medium text-right'>{currency}{coupon ? (totalPrice - (coupon.discount / 100 * totalPrice)).toFixed(2) : totalPrice.toLocaleString()}</p>
            </div>
            <button onClick={e => toast.promise(handlePlaceOrder(e), { loading: 'placing Order...' })} className='w-full bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 active:scale-95 transition-all'>Place Order</button>

            {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />}

        </div>
    )
}

export default OrderSummary