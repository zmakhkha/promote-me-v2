import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, MessageCircle, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-rose-500" />
            <h1 className="text-2xl font-bold text-gray-900">Link&Match</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-rose-500 hover:bg-rose-600">Join Now</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Find Your Perfect Match</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with like-minded people in your area. Because love, too, can be industrialized.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-rose-500 hover:bg-rose-600 text-lg px-8 py-3">
              Start Your Journey
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-rose-500 mx-auto mb-4" />
              <CardTitle>Smart Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Our algorithm finds compatible matches based on location, interests, and preferences.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <MessageCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
              <CardTitle>Real-time Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect instantly with your matches through our secure messaging system.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Heart className="h-12 w-12 text-rose-500 mx-auto mb-4" />
              <CardTitle>Mutual Likes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Only chat when both users are interested. No unwanted messages.</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-rose-500 mx-auto mb-4" />
              <CardTitle>Safe & Secure</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your privacy and security are our top priorities with verified profiles.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Find Love?</h3>
          <p className="text-gray-600 mb-8">Join thousands of singles who have found their perfect match on Matcha.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-rose-500 hover:bg-rose-600">
                Create Free Account
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-6 w-6 text-rose-500" />
            <span className="text-xl font-bold">Matcha</span>
          </div>
          <p className="text-gray-400">© 2025 Matcha Dating. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
