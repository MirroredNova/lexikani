'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/modal';
import { Form } from '@heroui/form';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { createLanguage, updateLanguage, deleteLanguage } from '@/lib/server/admin.actions';
import type { Language } from '@/types';

interface LanguageManagerProps {
  initialLanguages: Language[];
}

export default function LanguageManager({ initialLanguages }: LanguageManagerProps) {
  const [languages] = useState(initialLanguages);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError('');

    try {
      let result;
      if (editingLanguage) {
        result = await updateLanguage(editingLanguage.id, formData);
      } else {
        result = await createLanguage(formData);
      }

      if (result.error) {
        setError(result.error);
        return;
      }

      // Refresh the page data
      window.location.reload();
    } catch (error) {
      console.error('Error saving language:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (language: Language) => {
    if (
      !confirm(`Are you sure you want to delete "${language.name}"? This action cannot be undone.`)
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await deleteLanguage(language.id);
      if (result.error) {
        setError(result.error);
      } else {
        // Refresh the page data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting language:', error);
      setError('Failed to delete language');
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (language?: Language) => {
    setEditingLanguage(language || null);
    setError('');
    onOpen();
  };

  const closeModal = () => {
    setEditingLanguage(null);
    setError('');
    onClose();
  };

  return (
    <>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Languages ({languages.length})</h2>
          <Button
            color="primary"
            startContent={<PlusIcon className="w-4 h-4" />}
            onPress={() => openModal()}
          >
            Add Language
          </Button>
        </CardHeader>
        <CardBody>
          <Table aria-label="Languages table">
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>CODE</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No languages found">
              {languages.map(language => (
                <TableRow key={language.id}>
                  <TableCell className="font-medium">{language.name}</TableCell>
                  <TableCell>
                    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                      {language.code}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="light"
                        isIconOnly
                        onPress={() => openModal(language)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="light"
                        color="danger"
                        isIconOnly
                        onPress={() => handleDelete(language)}
                        isDisabled={isLoading}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalContent>
          <Form action={handleSubmit}>
            <ModalHeader>{editingLanguage ? 'Edit Language' : 'Add New Language'}</ModalHeader>
            <ModalBody className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                </div>
              )}

              <Input
                label="Language Name"
                name="name"
                placeholder="e.g., Norwegian"
                defaultValue={editingLanguage?.name || ''}
                isRequired
              />

              <Input
                label="Language Code"
                name="code"
                placeholder="e.g., no"
                defaultValue={editingLanguage?.code || ''}
                description="ISO language code (lowercase)"
                isRequired
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={closeModal} isDisabled={isLoading}>
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={isLoading}>
                {editingLanguage ? 'Update' : 'Create'}
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
    </>
  );
}
