import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Timestamp } from 'firebase/firestore';
import { Input, FormGroup, Label } from '@shared/ui/Input';
import { Button } from '@shared/ui/Button';
import type { CRMObject } from '@shared/types';

// ─── Google Maps loader (new Places API) ──────────────────────────────────────

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

declare global {
  interface Window {
    google?: { maps?: { importLibrary?: (lib: string) => Promise<any> } };
  }
}

let _mapsPromise: Promise<void> | null = null;
function loadMaps(): Promise<void> {
  if (!MAPS_KEY) return Promise.resolve();
  if (_mapsPromise) return _mapsPromise;
  _mapsPromise = new Promise((resolve) => {
    if (window.google?.maps?.importLibrary) { resolve(); return; }
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&loading=async&libraries=places&language=de`;
    s.async = true;
    s.onload = () => resolve();
    document.head.appendChild(s);
  });
  return _mapsPromise;
}

// ─── Styled ───────────────────────────────────────────────────────────────────

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const AddressWrap = styled.div`
  position: relative;
`;

const SuggestionList = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0; right: 0;
  background: #1c1c1c;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.65);
  z-index: 99999;
  list-style: none;
  padding: 4px 0;
  margin: 0;
  max-height: 240px;
  overflow-y: auto;
`;

const SuggestionItem = styled.li`
  padding: 9px 14px;
  cursor: pointer;
  transition: background 0.1s;
  & + & { border-top: 1px solid rgba(255,255,255,0.04); }
  &:hover { background: rgba(255,255,255,0.07); }
`;

const SuggMain = styled.span`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SuggSub = styled.span`
  display: block;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 1px;
`;

const Hint = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: -4px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
`;

// ─── Component ────────────────────────────────────────────────────────────────

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
  const [title, setTitle]       = useState(initial.title ?? '');
  const [address, setAddress]   = useState(initial.address ?? '');
  const [city, setCity]         = useState(initial.city ?? '');
  const [deadline, setDeadline] = useState(
    initial.deadline?.toDate?.()
      ? initial.deadline.toDate().toISOString().slice(0, 10)
      : ''
  );
  const [loading, setLoading]     = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef     = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchSuggestions = useCallback(async (input: string) => {
    if (!input.trim() || !MAPS_KEY) { setSuggestions([]); return; }
    try {
      await loadMaps();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { AutocompleteSuggestion } = await (window.google!.maps!.importLibrary as any)('places');
      const { suggestions: results } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input,
        includedRegionCodes: ['de'],
      });
      setSuggestions(results ?? []);
    } catch {
      setSuggestions([]);
    }
  }, []);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAddress(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  // onMouseDown + preventDefault keeps focus on input while selecting
  const selectSuggestion = async (e: React.MouseEvent, suggestion: any) => {
    e.preventDefault();
    setSuggestions([]);
    try {
      const place = suggestion.placePrediction.toPlace();
      await place.fetchFields({ fields: ['addressComponents'] });
      const comps: any[] = place.addressComponents ?? [];
      const get = (type: string) =>
        comps.find((c: any) => c.types.includes(type))?.longText ?? '';
      const route  = get('route');
      const num    = get('street_number');
      const locale = get('locality') || get('postal_town') || get('administrative_area_level_2');
      if (route)  setAddress(route + (num ? ' ' + num : ''));
      if (locale) setCity(locale);
    } catch {
      const text: string = suggestion.placePrediction?.text?.toString() ?? '';
      if (text) setAddress(text.split(',')[0].trim());
    }
  };

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

      <FormGroup>
        <Label>Adresse *</Label>
        <AddressWrap ref={wrapRef}>
          <Input
            value={address}
            onChange={handleAddressChange}
            onBlur={() => setSuggestions([])}
            placeholder="Straße eingeben…"
            required
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <SuggestionList>
              {suggestions.map((s: any, i: number) => (
                <SuggestionItem key={i} onMouseDown={(e) => selectSuggestion(e, s)}>
                  <SuggMain>{s.placePrediction?.mainText?.toString() ?? ''}</SuggMain>
                  <SuggSub>{s.placePrediction?.secondaryText?.toString() ?? ''}</SuggSub>
                </SuggestionItem>
              ))}
            </SuggestionList>
          )}
        </AddressWrap>
        <Hint>Aus der Liste wählen — Stadt wird automatisch ausgefüllt.</Hint>
      </FormGroup>

      <Row>
        <FormGroup>
          <Label>Stadt *</Label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="z.B. Denzlingen"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Deadline</Label>
          <Input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </FormGroup>
      </Row>

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
