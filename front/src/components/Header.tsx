"use client";

import React, { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Heart,
  ChevronDown,
  Sun,
  Moon,
  Instagram,
  MessageCircle,
  Music,
} from "lucide-react"
import { Button } from "@/components/ui/button"


const Header = () => {
	const [isDarkMode, setIsDarkMode] = useState(false)
	
  return (
	<header className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-pink-500" />
            <span className="text-xl font-bold text-foreground">DateApp</span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost">Discover</Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Social <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  Instagram
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Snapchat
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  TikTok
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Profile <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Log Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </header>
  )
}

export default Header