import React from 'react';
import { useParams } from 'react-router-dom';
import { EntryForm } from '@features/hours/components/EntryForm';

/** /hours/new (add) and /hours/:id/edit (change one of your own entries). */
const HoursFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // key: switching between entries must start with a fresh form
  return <EntryForm key={id ?? 'new'} editId={id} />;
};

export default HoursFormPage;
