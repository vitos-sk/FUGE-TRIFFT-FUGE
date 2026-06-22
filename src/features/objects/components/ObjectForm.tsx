import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Timestamp } from 'firebase/firestore';
import { Input, FormGroup, Label } from '@shared/ui/Input';
import { Button } from '@shared/ui/Button';
import type { CRMObject } from '@shared/types';
import {
  Form,
  Row,
  AddressWrap,
  SuggestionList,
  SuggestionItem,
  SuggMain,
  SuggSub,
  Hint,
  Actions,
} from './ObjectForm.styles';

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
  const [title, setTitle]             = useState(initial.title ?? '');
  const [address, setAddress]         = useState(initial.address ?? '');
  const [city, setCity]               = useState(initial.city ?? '');
  const [whatsappLink, setWhatsappLink] = useState(initial.whatsappLink ?? '');
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
        deadline: deadline ? Timestamp.fromDate(new Date(deadline)) : null,
        whatsappLink: whatsappLink.trim() || undefined,
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

      <FormGroup>
        <Label>WhatsApp-Gruppe</Label>
        <Input
          value={whatsappLink}
          onChange={(e) => setWhatsappLink(e.target.value)}
          placeholder="https://chat.whatsapp.com/…"
          type="url"
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
