'use client';

import React, { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from '@heroui/navbar';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown';
import NextLink from 'next/link';
import { Button } from '@heroui/button';
import { useUser } from '@/contexts/user-context';
import { logout } from '@/lib/server/auth.actions';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/hooks/use-admin';
import {
  Cog6ToothIcon,
  UserIcon,
  ArrowRightStartOnRectangleIcon,
  EllipsisVerticalIcon,
  BookOpenIcon,
  ChartBarIcon,
  AcademicCapIcon,
  ArrowPathIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import { ThemeToggle } from '@/components/shared';

const NavigationBar = () => {
  const { user, loading, refreshUser } = useUser();
  const { isAdmin } = useAdmin();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const result = await logout();

      if (result?.error) {
        console.error('Logout error:', result.error);
        return;
      }

      // Logout was successful, refresh user state and redirect
      await refreshUser();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Mobile hamburger menu - Navigation links only
  const navigationItems = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Lessons', href: '/lessons', icon: AcademicCapIcon },
    { name: 'Reviews', href: '/reviews', icon: ArrowPathIcon },
    { name: 'Levels', href: '/levels', icon: ChartBarIcon },
    { name: 'Vocabulary', href: '/vocabulary', icon: BookOpenIcon },
  ];

  // Not logged in users get login/signup in hamburger
  const unauthenticatedItems = [
    { name: 'Login', href: '/login', icon: UserIcon },
    { name: 'Sign Up', href: '/signup', icon: UserIcon },
  ];

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      className="border-b border-divider"
      maxWidth="lg"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="sm:hidden"
        />
        <NavbarBrand>
          <NextLink href="/" className="font-bold text-inherit text-xl">
            Lexikani
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Navigation */}
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        <NavbarItem>
          <NextLink href="/levels" className="text-foreground hover:text-primary transition-colors">
            Levels
          </NextLink>
        </NavbarItem>
        <NavbarItem>
          <NextLink
            href="/vocabulary"
            className="text-foreground hover:text-primary transition-colors"
          >
            Vocabulary
          </NextLink>
        </NavbarItem>
      </NavbarContent>

      {/* Desktop Right Side */}
      <NavbarContent justify="end">
        {loading ? (
          <NavbarItem>
            <Button disabled size="sm">
              Loading...
            </Button>
          </NavbarItem>
        ) : user ? (
          <>
            {/* Theme Toggle - Always Visible */}
            <NavbarItem>
              <ThemeToggle size="sm" />
            </NavbarItem>

            {/* Desktop: Individual Buttons */}
            <NavbarItem className="hidden md:flex">
              <Button
                as={NextLink}
                href="/profile"
                variant="light"
                startContent={<UserIcon className="w-4 h-4" />}
                size="sm"
              >
                Profile
              </Button>
            </NavbarItem>

            {isAdmin && (
              <NavbarItem className="hidden md:flex">
                <Button
                  as={NextLink}
                  href="/admin"
                  variant="light"
                  startContent={<Cog6ToothIcon className="w-4 h-4" />}
                  size="sm"
                >
                  Admin
                </Button>
              </NavbarItem>
            )}

            <NavbarItem className="hidden md:flex">
              <Button
                onPress={handleLogout}
                variant="light"
                color="danger"
                startContent={<ArrowRightStartOnRectangleIcon className="w-4 h-4" />}
                size="sm"
              >
                Logout
              </Button>
            </NavbarItem>

            {/* Mobile: Dropdown Menu for Actions */}
            <NavbarItem className="md:hidden">
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="light" isIconOnly size="sm" aria-label="User menu">
                    <EllipsisVerticalIcon className="w-5 h-5" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="User actions">
                  {[
                    {
                      key: 'profile',
                      label: 'Profile',
                      icon: UserIcon,
                      href: '/profile',
                    },
                    ...(isAdmin
                      ? [
                          {
                            key: 'admin',
                            label: 'Admin',
                            icon: Cog6ToothIcon,
                            href: '/admin',
                          },
                        ]
                      : []),
                    {
                      key: 'logout',
                      label: 'Logout',
                      icon: ArrowRightStartOnRectangleIcon,
                      isDanger: true,
                      onPress: handleLogout,
                    },
                  ].map(item => (
                    <DropdownItem
                      key={item.key}
                      startContent={<item.icon className="w-4 h-4" />}
                      color={item.isDanger ? 'danger' : undefined}
                      href={item.href}
                      as={item.href ? NextLink : undefined}
                      onPress={item.onPress}
                    >
                      {item.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem>
              <ThemeToggle size="sm" />
            </NavbarItem>
            <NavbarItem className="hidden sm:flex">
              <NextLink href="/login" className="text-foreground">
                Login
              </NextLink>
            </NavbarItem>
            <NavbarItem>
              <Button as={NextLink} color="primary" href="/signup" variant="flat" size="sm">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      {/* Mobile Menu - Navigation Only */}
      <NavbarMenu>
        {user
          ? // Logged in users: Show navigation links only
            navigationItems.map((item, index) => (
              <NavbarMenuItem key={`${item.name}-${index}`}>
                <NextLink
                  className="w-full flex items-center gap-3 py-2 text-lg"
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </NextLink>
              </NavbarMenuItem>
            ))
          : // Not logged in: Show login/signup
            unauthenticatedItems.map((item, index) => (
              <NavbarMenuItem key={`${item.name}-${index}`}>
                <NextLink
                  className="w-full flex items-center gap-3 py-2 text-lg"
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </NextLink>
              </NavbarMenuItem>
            ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default NavigationBar;
