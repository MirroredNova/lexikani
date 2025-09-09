'use client';

import React, { useState, useTransition } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Textarea } from '@heroui/input';
import { Chip } from '@heroui/chip';
import { PencilIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { updateVocabularyNote } from '@/lib/server/notes.actions';
import { useRouter } from 'next/navigation';

interface VocabularyNotesProps {
  vocabularyId: number;
  word: string;
  initialNote?: string | null;
  variant?: 'button' | 'chip' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

const VocabularyNotes = React.memo<VocabularyNotesProps>(function VocabularyNotes({
  vocabularyId,
  word,
  initialNote = null,
  variant = 'button',
  size = 'sm',
}: VocabularyNotesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState(initialNote || '');
  const [optimisticNote, setOptimisticNote] = useState(initialNote || '');
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const router = useRouter();

  // Use optimistic note for display
  const hasNote = Boolean(optimisticNote?.trim());

  const handleSave = () => {
    // Optimistic update - immediately update the UI
    const newNote = note.trim();
    setOptimisticNote(newNote);
    setSaveStatus('saving');

    startTransition(async () => {
      try {
        const result = await updateVocabularyNote(vocabularyId, newNote);
        if (result.success) {
          setSaveStatus('saved');
          setIsOpen(false);
          // Only refresh if we need to sync other data
          router.refresh();
        } else {
          // Revert optimistic update on error
          setOptimisticNote(initialNote || '');
          setSaveStatus('error');
          console.error('Failed to save note:', result.error);
        }
      } catch (error) {
        // Revert optimistic update on error
        setOptimisticNote(initialNote || '');
        setSaveStatus('error');
        console.error('Error saving note:', error);
      }
    });
  };

  const handleOpen = () => {
    setNote(optimisticNote || '');
    setSaveStatus('idle');
    setIsOpen(true);
  };

  const renderTrigger = () => {
    switch (variant) {
      case 'chip':
        return (
          <Chip
            size={size}
            color={hasNote ? 'primary' : 'default'}
            variant={hasNote ? 'flat' : 'bordered'}
            startContent={<DocumentTextIcon className="w-3 h-3" />}
            className="cursor-pointer hover:shadow-sm transition-shadow"
            onClick={handleOpen}
          >
            {hasNote ? 'Has Note' : 'Add Note'}
          </Chip>
        );
      case 'icon':
        return (
          <Button
            isIconOnly
            size={size}
            variant="light"
            color={hasNote ? 'primary' : 'default'}
            onPress={handleOpen}
            className="min-w-unit-8 w-8 h-8"
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
        );
      default:
        return (
          <Button
            size={size}
            variant="light"
            color={hasNote ? 'primary' : 'default'}
            startContent={<DocumentTextIcon className="w-4 h-4" />}
            onPress={handleOpen}
          >
            {hasNote ? 'Edit Note' : 'Add Note'}
          </Button>
        );
    }
  };

  return (
    <>
      {renderTrigger()}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} placement="center" size="2xl">
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">Notes for &quot;{word}&quot;</h3>
                <p className="text-sm text-default-500">
                  Add personal notes, mnemonics, or examples to help you remember this word.
                </p>
              </ModalHeader>

              <ModalBody>
                <Textarea
                  value={note}
                  onValueChange={setNote}
                  placeholder="Enter your notes here... (e.g., mnemonics, usage examples, personal associations)"
                  minRows={4}
                  maxRows={8}
                  variant="bordered"
                  classNames={{
                    input: 'text-sm',
                  }}
                />

                {note.trim() && (
                  <div className="text-xs text-default-500 text-right">
                    {note.length} characters
                  </div>
                )}
              </ModalBody>

              <ModalFooter>
                <Button variant="light" onPress={onClose} disabled={isPending}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSave}
                  isLoading={isPending}
                  isDisabled={!note.trim()}
                >
                  {saveStatus === 'saving'
                    ? 'Saving...'
                    : saveStatus === 'saved'
                      ? 'Saved!'
                      : 'Save Note'}
                </Button>
                {saveStatus === 'error' && (
                  <p className="text-xs text-danger">Failed to save. Please try again.</p>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
});

export default VocabularyNotes;
