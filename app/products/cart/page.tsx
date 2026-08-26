import Link from 'next/link'
import React from 'react'

function cart() {
  return (
    <div>Cart Page
        <p>Your cart is empty.</p>
        <Link href="/products" className="text-blue-500">Continue Shopping</Link>

        <div className="mt-4">
          <Link href="/checkout" className="px-4 py-2 bg-blue-600 text-white rounded">Proceed to Checkout</Link>

        </div>
    </div>
  )
}

export default cart