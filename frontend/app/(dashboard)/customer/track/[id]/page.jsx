import { redirect } from 'next/navigation'
import ParcelDetails from './ParcelDetails'

export default async function Page({ params }) {
  const { id } = await params

  if(!id) redirect('/customer/parcels')
    
  return (
    <ParcelDetails 
      trackingNumber={id}
    />
  )
}