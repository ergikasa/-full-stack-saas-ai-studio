import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { dummyPublishedCreationData } from '../assets/assets'
import { Heart } from 'lucide-react'

const Community = () => {
  const [creations, setCreations] = useState([])
  const { user } = useUser()

  const fetchCreations = async () => {
    // sigurohu që çdo creation ka një array bosh si default për like
    const safeData = dummyPublishedCreationData.map(item => ({
      ...item,
      like: Array.isArray(item.like) ? item.like : []
    }))
    setCreations(safeData)
  }

  useEffect(() => {
    if (user) {
      fetchCreations()
    }
  }, [user])

  // funksioni për të shtuar/hequr like
  const toggleLike = (index) => {
    if (!user) return // nëse user s’është loguar, mos bëj asgjë

    setCreations(prev => {
      const updated = [...prev]
      const creation = { ...updated[index] }

      // kontrollo nëse user ka bërë already like
      if (creation.like.includes(user.id)) {
        // heq user.id nga lista e like
        creation.like = creation.like.filter(uid => uid !== user.id)
      } else {
        // shton user.id tek lista e like
        creation.like = [...creation.like, user.id]
      }

      updated[index] = creation
      return updated
    })
  }

  return (
    <div className='flex-1 h-screen flex flex-col gap-4 p-4 bg-gray-100'>
      <h2 className='text-2xl font-semibold'>Creations</h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {creations.map((creation, index) => (
          <div
            key={index}
            className='relative group rounded-lg overflow-hidden'
          >
            <img
              src={creation.content}
              alt={creation.prompt}
              className='w-full h-64 object-cover rounded-lg'
            />

            <div className='absolute inset-0 flex items-end justify-between p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'>
              <p className='text-sm text-white'>{creation.prompt}</p>
              <div className='flex gap-1 items-center'>
                <p className='text-white'>{creation.like?.length || 0}</p>
                <Heart
                  onClick={() => toggleLike(index)}
                  className={`h-5 w-5 cursor-pointer hover:scale-110 transition-transform ${
                    creation.like?.includes(user?.id)
                      ? 'fill-red-500 text-red-600'
                      : 'text-white'
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Community
