import { useState, useEffect, useRef, useCallback } from 'react';
import { deleteHourEntry, updateHourEntry } from '@features/hours/services';
import { subscribeToObjects } from '@features/objects/services';
import { useToast } from '@shared/ui/Toast';
import { useConfirm } from '@shared/ui/ConfirmDialog';
import { useAuth } from '@features/auth/hooks';
import type { WorkHourEntry, CRMObject } from '@shared/types';
import { calcMinutes } from '../utils/timeUtils';

interface UseHoursTableProps {
  onDelete?: () => void;
}

export const useHoursTable = ({ onDelete }: UseHoursTableProps) => {
  const { uid } = useAuth();
  const toast = useToast();
  const confirm = useConfirm();

  // ── Custom scrollbar ────────────────────────────────────────────────────
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [thumbState, setThumbState] = useState({ left: 0, width: 100 });
  const [hasOverflow, setHasOverflow] = useState(false);

  const updateThumb = useCallback(() => {
    const el = tableWrapperRef.current;
    if (!el) return;
    const ratio = el.clientWidth / el.scrollWidth;
    const overflows = ratio < 0.999;
    setHasOverflow(overflows);
    if (!overflows) return;
    const thumbW = Math.max(ratio * 100, 8);
    const maxScroll = el.scrollWidth - el.clientWidth;
    const scrollRatio = maxScroll > 0 ? el.scrollLeft / maxScroll : 0;
    setThumbState({ left: scrollRatio * (100 - thumbW), width: thumbW });
  }, []);

  useEffect(() => {
    const el = tableWrapperRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateThumb, { passive: true });
    const ro = new ResizeObserver(updateThumb);
    ro.observe(el);
    updateThumb();
    return () => { el.removeEventListener('scroll', updateThumb); ro.disconnect(); };
  }, [updateThumb]);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const el = tableWrapperRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    el.scrollLeft = ratio * (el.scrollWidth - el.clientWidth);
  };

  const handleThumbPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const el = tableWrapperRef.current;
    const thumb = thumbRef.current;
    if (!el || !thumb) return;
    const startX = e.clientX;
    const startScroll = el.scrollLeft;
    const trackW = thumb.parentElement!.clientWidth;
    const thumbW = thumb.clientWidth;
    const maxScroll = el.scrollWidth - el.clientWidth;
    thumb.setPointerCapture(e.pointerId);
    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      el.scrollLeft = startScroll + (dx / (trackW - thumbW)) * maxScroll;
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };
  // ────────────────────────────────────────────────────────────────────────

  // ── Edit state ──────────────────────────────────────────────────────────
  const [editEntry, setEditEntry] = useState<WorkHourEntry | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');
  const [editBreak, setEditBreak] = useState(0);
  const [editObjectId, setEditObjectId] = useState('');
  const [editLocationText, setEditLocationText] = useState('');
  const [objects, setObjects] = useState<CRMObject[]>([]);
  const [saving, setSaving] = useState(false);
  const [editDatePickerOpen, setEditDatePickerOpen] = useState(false);
  const [editStartPickerOpen, setEditStartPickerOpen] = useState(false);
  const [editEndPickerOpen, setEditEndPickerOpen] = useState(false);
  const [editObjectPickerOpen, setEditObjectPickerOpen] = useState(false);

  useEffect(() => {
    const unsub = subscribeToObjects((data) => {
      const active = data.filter((o) => !o.archived);
      active.sort((a, b) => {
        const ta = (a.lastActivityAt ?? a.lastNoteAt ?? a.createdAt)?.toDate?.()?.getTime() ?? 0;
        const tb = (b.lastActivityAt ?? b.lastNoteAt ?? b.createdAt)?.toDate?.()?.getTime() ?? 0;
        return tb - ta;
      });
      setObjects(active);
    });
    return unsub;
  }, []);

  const openEdit = (entry: WorkHourEntry) => {
    setEditEntry(entry);
    setEditDate(entry.date);
    setEditStart(entry.startTime);
    setEditEnd(entry.endTime);
    setEditBreak(entry.breakMinutes);
    setEditObjectId(entry.objectId ?? '');
    setEditLocationText(!entry.objectId && entry.objectTitle ? entry.objectTitle : '');
  };

  const handleSave = async () => {
    if (!editEntry) return;
    const totalMinutes = calcMinutes(editStart, editEnd, editBreak);
    if (totalMinutes <= 0) return;
    setSaving(true);
    try {
      const selectedObj = objects.find((o) => o.id === editObjectId);
      await updateHourEntry(editEntry.id, {
        date: editDate,
        startTime: editStart,
        endTime: editEnd,
        breakMinutes: editBreak,
        totalMinutes,
        objectId: editObjectId || null,
        objectTitle: editObjectId
          ? selectedObj?.title
          : editLocationText.trim() || undefined,
      });
      toast.success('Stunden aktualisiert');
      setEditEntry(null);
      onDelete?.();
    } catch {
      toast.error('Fehler beim Speichern.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, date: string) => {
    const ok = await confirm({
      title: 'Eintrag löschen',
      message: `Stundeneintrag vom ${date} wirklich löschen?`,
      confirmLabel: 'Löschen',
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteHourEntry(id);
      toast.success('Eintrag gelöscht');
      onDelete?.();
    } catch {
      toast.error('Fehler beim Löschen.');
    }
  };

  const editTotal = calcMinutes(editStart, editEnd, editBreak);
  const editObjTitle = editObjectId
    ? (objects.find((o) => o.id === editObjectId)?.title ?? editObjectId)
    : '⚠ kein Objekt';

  return {
    uid,
    // scrollbar
    tableWrapperRef,
    thumbRef,
    thumbState,
    hasOverflow,
    handleTrackClick,
    handleThumbPointerDown,
    // edit
    editEntry, setEditEntry,
    editDate, setEditDate,
    editStart, setEditStart,
    editEnd, setEditEnd,
    editBreak, setEditBreak,
    editObjectId, setEditObjectId,
    editLocationText, setEditLocationText,
    objects,
    saving,
    editDatePickerOpen, setEditDatePickerOpen,
    editStartPickerOpen, setEditStartPickerOpen,
    editEndPickerOpen, setEditEndPickerOpen,
    editObjectPickerOpen, setEditObjectPickerOpen,
    editTotal,
    editObjTitle,
    openEdit,
    handleSave,
    handleDelete,
  };
};
