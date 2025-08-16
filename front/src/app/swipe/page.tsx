"use client"

import { useRef, useState } from "react"
import { Heart, X, MapPin, Briefcase } from "lucide-react"

interface UserProfile {
  id: number
  name: string
  age: number
  bio: string
  location: string
  occupation: string
  image: string
  interests: string[]
}

const SwipeableCardsPage = () => {
  const [profiles] = useState<UserProfile[]>([
    {
      id: 1,
      name: "Emma",
      age: 28,
      bio: "Adventure seeker, coffee enthusiast, and dog lover. Always up for trying new restaurants or hiking trails!",
      location: "San Francisco, CA",
      occupation: "UX Designer",
      image: "/beautiful-woman-smiling.png",
      interests: ["Photography", "Hiking", "Coffee"],
    },
    {
      id: 2,
      name: "Alex",
      age: 32,
      bio: "Passionate about sustainable living and good music. Weekend warrior who loves rock climbing and cooking.",
      location: "Portland, OR",
      occupation: "Software Engineer",
      image: "/handsome-bearded-man-outdoors.png",
      interests: ["Rock Climbing", "Cooking", "Music"],
    },
    {
      id: 3,
      name: "Sofia",
      age: 26,
      bio: "Artist by day, foodie by night. Love exploring local art galleries and trying fusion cuisine.",
      location: "Austin, TX",
      occupation: "Graphic Artist",
      image: "/artistic-woman-colorful.png",
      interests: ["Art", "Food", "Travel"],
    },
    {
      id: 4,
      name: "Marcus",
      age: 29,
      bio: "Fitness enthusiast and book lover. Always looking for someone to share good conversations and adventures with.",
      location: "Denver, CO",
      occupation: "Personal Trainer",
      image: "/athletic-man-smiling.png",
      interests: ["Fitness", "Reading", "Adventure"],
    },
    {
      id: 5,
      name: "Luna",
      age: 24,
      bio: "Marine biologist who loves the ocean and everything in it. Passionate about conservation and travel.",
      location: "San Diego, CA",
      occupation: "Marine Biologist",
      image: "/woman-ocean-marine-life.png",
      interests: ["Ocean", "Conservation", "Diving"],
    },
  ])

  const [currentCards, setCurrentCards] = useState(profiles)
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true)
    setStartPos({ x: clientX, y: clientY })
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return
    const deltaX = clientX - startPos.x
    const deltaY = clientY - startPos.y
    setDragOffset({ x: deltaX, y: deltaY })
  }

  const handleEnd = () => {
    if (!isDragging) return
    const threshold = 100
    if (Math.abs(dragOffset.x) > threshold) {
      swipeCard(dragOffset.x > 0 ? "right" : "left")
    } else {
      setDragOffset({ x: 0, y: 0 })
    }
    setIsDragging(false)
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => handleStart(e.clientX, e.clientY)
  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX, e.clientY)
  const handleMouseUp = () => handleEnd()

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) =>
    handleStart(e.touches[0].clientX, e.touches[0].clientY)
  const handleTouchMove = (e: React.TouchEvent) =>
    handleMove(e.touches[0].clientX, e.touches[0].clientY)
  const handleTouchEnd = () => handleEnd()

  const swipeCard = (direction: "left" | "right") => {
    setFeedback(direction === "right" ? "like" : "dislike")
    setTimeout(() => {
      setCurrentCards((prev) => prev.slice(1))
      setDragOffset({ x: 0, y: 0 })
      setFeedback(null)
    }, 300)
  }

  const rotation = dragOffset.x * 0.1
  const opacity = Math.max(0.7, 1 - Math.abs(dragOffset.x) / 200)

  if (currentCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-red-50">
        <Heart className="w-16 h-16 text-pink-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No more profiles!</h2>
        <p className="text-gray-600">Check back later for more matches.</p>
      </div>
    )
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-red-50 p-4">
      {/* Feedback Animation */}
      {feedback && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div
            className={`p-4 rounded-full animate-pulse ${
              feedback === "like" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {feedback === "like" ? <Heart className="w-12 h-12" /> : <X className="w-12 h-12" />}
          </div>
        </div>
      )}

      {/* Card Stack */}
      <div className="relative w-80 h-[600px] mb-8">
        {currentCards.slice(0, 3).map((profile, index) => {
          const isTopCard = index === 0
          const zIndex = currentCards.length - index
          const scale = 1 - index * 0.05
          const yOffset = index * 8

          return (
            <div
              key={profile.id}
              ref={isTopCard ? cardRef : null}
              className="absolute inset-0 bg-white rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
              style={{
                transform: isTopCard
                  ? `translateX(${dragOffset.x}px) translateY(${dragOffset.y + yOffset}px) rotate(${rotation}deg) scale(${scale})`
                  : `translateY(${yOffset}px) scale(${scale})`,
                zIndex,
                opacity: isTopCard ? opacity : 1,
                transition: isDragging ? "none" : "transform 0.3s ease-out",
              }}
              onMouseDown={isTopCard ? handleMouseDown : undefined}
              onMouseMove={isTopCard ? handleMouseMove : undefined}
              onMouseUp={isTopCard ? handleMouseUp : undefined}
              onMouseLeave={isTopCard ? handleMouseUp : undefined}
              onTouchStart={isTopCard ? handleTouchStart : undefined}
              onTouchMove={isTopCard ? handleTouchMove : undefined}
              onTouchEnd={isTopCard ? handleTouchEnd : undefined}
            >
              {/* Profile Image */}
              <div className="relative h-2/3">
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Swipe Hints */}
                {isTopCard && dragOffset.x > 50 && (
                  <div className="absolute top-8 right-8 bg-green-500 text-white px-4 py-2 rounded-full font-bold transform rotate-12">
                    LIKE
                  </div>
                )}
                {isTopCard && dragOffset.x < -50 && (
                  <div className="absolute top-8 left-8 bg-red-500 text-white px-4 py-2 rounded-full font-bold transform -rotate-12">
                    NOPE
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="p-6 h-1/3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold text-gray-800">{profile.name}</h3>
                    <span className="text-xl text-gray-600">{profile.age}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 mb-3">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm">{profile.occupation}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">{profile.bio}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {profile.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-6">
        <button
          className="w-16 h-16 flex items-center justify-center rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
          onClick={() => swipeCard("left")}
        >
          <X className="w-6 h-6" />
        </button>
        <button
          className="w-16 h-16 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 text-white transition"
          onClick={() => swipeCard("right")}
        >
          <Heart className="w-6 h-6" />
        </button>
      </div>
    </main>
  )
}

export default SwipeableCardsPage
