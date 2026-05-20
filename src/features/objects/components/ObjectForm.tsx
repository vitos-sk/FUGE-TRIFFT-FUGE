import React, { useState } from 'react';
import styled from 'styled-components';
import { Timestamp } from 'firebase/firestore';
import { Input, Select, FormGroup, Label } from '@shared/ui/Input';
import { Button } from '@shared/ui/Button';
import type { CRMObject } from '@shared/types';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
`;

interface Props {
  initial?: Partial<CRMObject>;
  onSubmit: (data: Partial<CRMObject>) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export const ObjectForm: React.FC<Props> = ({
  initial = {},
  onSubmit,
  onCancel,
  submitLabel = 'Speichern',
}) => {
  const [title, setTitle] = useState(initial.title ?? '');
  const [address, setAddress] = useState(initial.address ?? '');
  const [city, setCity] = useState(initial.city ?? '');
  const [deadline, setDeadline] = useState(
    initial.deadline?.toDate?.()
      ? initial.deadline.toDate().toISOString().slice(0, 10)
      : ''
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        title,
        address,
        city,
        status: 'new',
        deadline: deadline ? Timestamp.fromDate(new Date(deadline)) : null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>Objektname *</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="z.B. Bad Herr Müller"
          required
        />
      </FormGroup>

      <Row>
        <FormGroup>
          <Label>Adresse *</Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Straße + Hausnummer"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Stadt *</Label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="z.B. Denzlingen"
            required
          />
        </FormGroup>
      </Row>

      <FormGroup>
        <Label>Deadline</Label>
        <Input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </FormGroup>

      <Actions>
        <Button type="button" $variant="secondary" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button type="submit" disabled={loading || !title || !address || !city}>
          {loading ? 'Speichern…' : submitLabel}
        </Button>
      </Actions>
    </Form>
  );
};
