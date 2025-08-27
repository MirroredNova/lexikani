'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table';
import { ShieldCheckIcon, UserIcon } from '@heroicons/react/24/outline';
import { toggleUserAdmin } from '@/lib/server/admin.actions';

interface User {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
  createdAt: Date | null;
}

interface UserManagerProps {
  initialUsers: User[];
}

export default function UserManager({ initialUsers }: UserManagerProps) {
  const [users, setUsers] = useState(initialUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleToggleAdmin = async (user: User) => {
    const action = user.isAdmin ? 'remove admin privileges from' : 'grant admin privileges to';
    if (!confirm(`Are you sure you want to ${action} "${user.email}"?`)) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await toggleUserAdmin(user.id);
      if (result.error) {
        setError(result.error);
      } else {
        // Update local state
        setUsers(users.map(u => (u.id === user.id ? { ...u, isAdmin: !u.isAdmin } : u)));
      }
    } catch (error) {
      console.error('Error toggling admin status:', error);
      setError('Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Users ({users.length})</h2>
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}
      </CardHeader>
      <CardBody>
        <Table aria-label="Users table">
          <TableHeader>
            <TableColumn>USER</TableColumn>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>JOINED</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No users found">
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full">
                      {user.isAdmin ? (
                        <ShieldCheckIcon className="w-4 h-4 text-primary" />
                      ) : (
                        <UserIcon className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{user.name || 'Unnamed User'}</p>
                      <p className="text-sm text-gray-500">{user.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip size="sm" color={user.isAdmin ? 'warning' : 'default'} variant="flat">
                    {user.isAdmin ? 'Admin' : 'User'}
                  </Chip>
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="light"
                    color={user.isAdmin ? 'danger' : 'warning'}
                    onPress={() => handleToggleAdmin(user)}
                    isDisabled={isLoading}
                  >
                    {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
