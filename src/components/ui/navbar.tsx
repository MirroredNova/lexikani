'use client';

import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar';
import NextLink from 'next/link';
import { Button } from '@heroui/button';
import { useUser } from '@/contexts/user-context';
import { logout } from '@/lib/server/auth.actions';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/hooks/use-admin';
import { Cog6ToothIcon, UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { ThemeToggle } from '@/components/shared';

const NavigationBar = () => {
  const { user, loading, refreshUser } = useUser();
  const { isAdmin } = useAdmin();
  const router = useRouter();

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

  return (
    <Navbar>
      <NavbarBrand>
        <NextLink href="/" className="font-bold text-inherit">
          Lexikani
        </NextLink>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <NextLink href="/levels" className="text-foreground">
            Levels
          </NextLink>
        </NavbarItem>
        <NavbarItem>
          <NextLink href="/vocabulary" className="text-foreground">
            Vocabulary
          </NextLink>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        {loading ? (
          <NavbarItem>
            <Button disabled>Loading...</Button>
          </NavbarItem>
        ) : user ? (
          <>
            <NavbarItem>
              <ThemeToggle size="sm" />
            </NavbarItem>
            <NavbarItem>
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
              <NavbarItem>
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
            <NavbarItem>
              <Button
                onPress={handleLogout}
                variant="light"
                color="danger"
                startContent={<ArrowRightOnRectangleIcon className="w-4 h-4" />}
                size="sm"
              >
                Logout
              </Button>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem>
              <ThemeToggle size="sm" />
            </NavbarItem>
            <NavbarItem className="hidden lg:flex">
              <NextLink href="/login">Login</NextLink>
            </NavbarItem>
            <NavbarItem>
              <Button as={NextLink} color="primary" href="/signup" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default NavigationBar;
