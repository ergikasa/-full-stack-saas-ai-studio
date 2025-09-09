import React, { useEffect, useState } from 'react'
import { dummyCreationData } from '../assets/assets'
import { GemIcon, Plane, Sparkles, Zap, Crown, Rocket } from 'lucide-react'
import { Protect, useUser } from '@clerk/clerk-react'
import CreationItem from '../components/CreationItem'
import Plan from '../components/Plan'

const Dashboard = () => {
  const [creations, setCreations] = useState([])
  const { user, isLoaded } = useUser()

  const getDashboardData = async () => {
    setCreations(dummyCreationData)
  }

  useEffect(() => {
    getDashboardData()
  }, [])

  if (!isLoaded) {
    return <div className='p-6 flex items-center justify-center min-h-screen bg-gray-50'>Loading dashboard...</div>
  }
  
  // Funksion për të gjeneruar gradient të rastësishëm për kartela
  const getRandomGradient = () => {
    const gradients = [
      'bg-gradient-to-br from-[#3588F2] to-[#0BB0D7]',
      'bg-gradient-to-br from-[#FF6B6B] to-[#FF9E6D]',
      'bg-gradient-to-br from-[#7C3AED] to-[#EC4899]',
      'bg-gradient-to-br from-[#10B981] to-[#3B82F6]'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Welcome back, {user.firstName}!</h1>
        <p className='text-gray-600'>Here's your creative dashboard</p>
      </div>
      
      <div className='flex flex-col md:flex-row justify-start gap-4 mb-8'>
        {/* Total creations card */}
        <div className='flex justify-between items-center w-full md:w-72 p-4 px-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200'>
          <div className='text-slate-600'>
            <p className='text-sm font-medium text-gray-500'>Total creations</p>
            <h2 className='text-2xl font-bold text-gray-800'>{creations.length}</h2>
          </div>
          <div className={`w-12 h-12 rounded-lg ${getRandomGradient()} text-white flex justify-center items-center`}>
            <Sparkles className='w-6 h-6' />
          </div>
        </div>  

        {/* Active plan card */}
        <div className='flex justify-between items-center w-full md:w-72 p-4 px-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200'>
          <div className='text-slate-600'>
            <p className='text-sm font-medium text-gray-500'>Active Plan</p>
            <h2 className='text-2xl font-bold text-gray-800'>
              <Protect plan='premium' fallback="Free">
                <span className='flex items-center gap-1'>
                  Premium <Crown className='w-5 h-5 text-yellow-500' />
                </span>
              </Protect>
            </h2>
          </div>
          <div className={`w-12 h-12 rounded-lg ${getRandomGradient()} text-white flex justify-center items-center`}>
            <Zap className='w-6 h-6' />
          </div>
        </div>

      
      </div>

      <div className='bg-white rounded-xl border border-gray-200 shadow-sm p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-semibold text-gray-800'>Recent Creations</h2>
         
        </div>
        
        <div className='space-y-4'>
          {creations.length > 0 ? (
            creations.map((item) => <CreationItem key={item.id} item={item} />)
          ) : (
            <div className='text-center py-10'>
              <div className='w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                <Sparkles className='w-8 h-8 text-gray-400' />
              </div>
              <h3 className='text-lg font-medium text-gray-700 mb-1'>No creations yet</h3>
              <p className='text-gray-500'>Start creating your first project</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

