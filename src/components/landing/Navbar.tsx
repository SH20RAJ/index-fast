'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Equal, X, Moon, Sun } from 'lucide-react'
import { useUser } from '@stackframe/stack'
import { useColorMode } from '@/components/ThemeRegistry'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const menuItems = [
  { name: 'Home', href: '/' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'Pricing', href: '/#pricing' },
]

export default function Navbar() {
  const user = useUser()
  const pathname = usePathname()
  const { mode, toggleColorMode } = useColorMode()
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function isActiveLink(href: string) {
    if (href === '/') return pathname === '/'
    if (href.startsWith('/how-it-works')) return pathname.startsWith('/how-it-works')
    return false
  }

  return (
    <header>
      <nav
        data-state={menuState ? 'active' : undefined}
        className="fixed left-0 w-full z-50 px-2"
      >
        <div
          className={cn(
            'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12',
            isScrolled &&
              'bg-background/70 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5 shadow-sm shadow-black/5',
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 lg:gap-0 py-2 lg:py-3">
            {/* Logo */}
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="IndexFast home"
                className="flex items-center gap-2.5 transition-transform hover:scale-105"
              >
                <Image
                  src="/logo.png"
                  alt="IndexFast logo"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-lg object-cover shadow-sm"
                />
                <span className="text-base font-bold tracking-tight text-foreground">
                  IndexFast
                </span>
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Equal
                  className={cn(
                    'm-auto size-6 transition-all duration-200',
                    menuState && 'rotate-180 scale-0 opacity-0',
                  )}
                />
                <X
                  className={cn(
                    'absolute inset-0 m-auto size-6 transition-all duration-200',
                    menuState
                      ? 'rotate-0 scale-100 opacity-100'
                      : '-rotate-180 scale-0 opacity-0',
                  )}
                />
              </button>
            </div>

            {/* Desktop nav links (centered) */}
            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={cn(
                        'block duration-150 text-sm font-medium',
                        isActiveLink(item.href)
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right side actions */}
            <div
              className={cn(
                'bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex',
                'mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6',
                'shadow-2xl shadow-zinc-300/20 md:flex-nowrap',
                'lg:m-0 lg:flex lg:w-fit lg:gap-3 lg:space-y-0 lg:rounded-none lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none',
                'dark:shadow-none dark:lg:bg-transparent',
              )}
            >
              {/* Mobile links */}
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index} onClick={() => setMenuState(false)}>
                      <Link
                        href={item.href}
                        className={cn(
                          'block duration-150',
                          isActiveLink(item.href)
                            ? 'text-foreground font-semibold'
                            : 'text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-2 sm:space-y-0 md:w-fit items-center">
                {/* Dark mode toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleColorMode}
                  aria-label="Toggle dark mode"
                  className="h-8 w-8 hidden lg:inline-flex"
                >
                  {mode === 'dark' ? (
                    <Sun className="h-4 w-4 transition-transform hover:rotate-90" />
                  ) : (
                    <Moon className="h-4 w-4 transition-transform hover:-rotate-12" />
                  )}
                </Button>

                {user ? (
                  <Button asChild size="sm" className={cn('font-semibold shadow-md', isScrolled && 'lg:inline-flex')}>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className={cn(isScrolled && 'lg:hidden')}
                    >
                      <Link href="/sign-in">
                        <span>Sign In</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className={cn(isScrolled && 'lg:hidden')}
                    >
                      <Link href="/sign-up">
                        <span>Sign Up</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}
                    >
                      <Link href="/sign-up">
                        <span>Get Started</span>
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
