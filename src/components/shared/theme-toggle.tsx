'use client';

import React from 'react';
import { Button } from '@heroui/button';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown';
import { SunIcon, MoonIcon, ComputerDesktopIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/contexts/theme-context';

interface ThemeToggleProps {
  variant?: 'button' | 'dropdown';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function ThemeToggle({
  variant = 'button',
  size = 'md',
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme();

  const getThemeIcon = (themeName: 'light' | 'dark' | 'system', isActive = false) => {
    const iconClass = `w-4 h-4 ${isActive ? 'text-primary' : ''}`;
    switch (themeName) {
      case 'light':
        return <SunIcon className={iconClass} />;
      case 'dark':
        return <MoonIcon className={iconClass} />;
      case 'system':
        return <ComputerDesktopIcon className={iconClass} />;
    }
  };

  if (variant === 'button') {
    return (
      <Button
        isIconOnly={!showLabel}
        variant="ghost"
        size={size}
        onPress={toggleTheme}
        className="min-w-unit-8 w-unit-8 h-unit-8"
        aria-label={`Switch to ${actualTheme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {actualTheme === 'dark' ? (
          <>
            <SunIcon className="w-4 h-4" />
            {showLabel && <span className="ml-2">Light</span>}
          </>
        ) : (
          <>
            <MoonIcon className="w-4 h-4" />
            {showLabel && <span className="ml-2">Dark</span>}
          </>
        )}
      </Button>
    );
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="ghost" size={size} className="min-w-unit-8" aria-label="Theme selection">
          {getThemeIcon(actualTheme)}
          {showLabel && (
            <span className="ml-2 capitalize">{theme === 'system' ? 'System' : actualTheme}</span>
          )}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Theme selection"
        selectedKeys={[theme]}
        selectionMode="single"
        onSelectionChange={keys => {
          const selectedTheme = Array.from(keys)[0] as 'light' | 'dark' | 'system';
          setTheme(selectedTheme);
        }}
      >
        <DropdownItem key="light" startContent={getThemeIcon('light', theme === 'light')}>
          <div className="flex items-center justify-between w-full">
            Light
            {theme === 'light' && <CheckIcon className="w-4 h-4" />}
          </div>
        </DropdownItem>
        <DropdownItem key="dark" startContent={getThemeIcon('dark', theme === 'dark')}>
          <div className="flex items-center justify-between w-full">
            Dark
            {theme === 'dark' && <CheckIcon className="w-4 h-4" />}
          </div>
        </DropdownItem>
        <DropdownItem key="system" startContent={getThemeIcon('system', theme === 'system')}>
          <div className="flex items-center justify-between w-full">
            System
            {theme === 'system' && <CheckIcon className="w-4 h-4" />}
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
