import { useEffect, useState } from 'react';
import { onSnapshot, doc as fsDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@shared/services/firebase';
import { updateObject, deleteObject, updateMaterials, updateChecklist } from '@shared/services/objectsService';
import { useToast } from '@shared/ui/Toast';
import { useConfirm } from '@shared/ui/ConfirmDialog';
import type { CRMObject, Material, ChecklistItem, TabId } from '@shared/types';

export const useObjectDetail = (id: string | undefined, onDeleteNavigate: () => void) => {
  const toast = useToast();
  const confirm = useConfirm();
  const [object, setObject] = useState<CRMObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabId>('notes');
  const [showEditModal, setShowEditModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState('');
  const [newCheckItem, setNewCheckItem] = useState('');

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(
      fsDoc(db, 'objects', id),
      (snap) => {
        if (!snap.exists()) {
          setObject(null);
        } else {
          const obj = { id: snap.id, ...snap.data() } as CRMObject;
          obj.materials = obj.materials ?? [];
          obj.checklist = obj.checklist ?? [];
          setObject(obj);
        }
        setLoading(false);
      },
      () => { toast.error('Objekt konnte nicht geladen werden.'); setLoading(false); }
    );
    return unsub;
  }, [id]);

  const handleUpdate = async (data: Partial<CRMObject>) => {
    if (!object) return;
    try {
      await updateObject(object.id, data);
      setObject((prev) => prev ? { ...prev, ...data } : prev);
      setShowEditModal(false);
      toast.success('Objekt gespeichert');
    } catch {
      toast.error('Fehler beim Speichern.');
    }
  };

  const handleDelete = async () => {
    if (!object) return;
    const ok = await confirm({
      title: 'Objekt löschen',
      message: `"${object.title}" wirklich permanent löschen? Alle Notizen und Fotos gehen verloren.`,
      confirmLabel: 'Löschen',
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteObject(object.id);
      toast.success('Objekt gelöscht');
      onDeleteNavigate();
    } catch {
      toast.error('Fehler beim Löschen.');
    }
  };

  const addMaterial = async () => {
    if (!object || !newMaterial.trim()) return;
    const updated: Material[] = [
      ...object.materials,
      { id: uuidv4(), name: newMaterial.trim(), status: 'needed' },
    ];
    try {
      await updateMaterials(object.id, updated);
      setObject((prev) => prev ? { ...prev, materials: updated } : prev);
      setNewMaterial('');
      toast.success('Material hinzugefügt');
    } catch {
      toast.error('Fehler beim Hinzufügen.');
    }
  };

  const updateMaterialStatus = async (matId: string, status: Material['status']) => {
    if (!object) return;
    const updated = object.materials.map((m) => m.id === matId ? { ...m, status } : m);
    try {
      await updateMaterials(object.id, updated);
      setObject((prev) => prev ? { ...prev, materials: updated } : prev);
    } catch {
      toast.error('Fehler beim Aktualisieren.');
    }
  };

  const removeMaterial = async (matId: string) => {
    if (!object) return;
    const ok = await confirm({
      title: 'Material entfernen',
      message: 'Dieses Material wirklich entfernen?',
      confirmLabel: 'Entfernen',
      danger: true,
    });
    if (!ok) return;
    const updated = object.materials.filter((m) => m.id !== matId);
    try {
      await updateMaterials(object.id, updated);
      setObject((prev) => prev ? { ...prev, materials: updated } : prev);
    } catch {
      toast.error('Fehler beim Entfernen.');
    }
  };

  const addCheckItem = async () => {
    if (!object || !newCheckItem.trim()) return;
    const updated: ChecklistItem[] = [
      ...object.checklist,
      { id: uuidv4(), text: newCheckItem.trim(), done: false },
    ];
    try {
      await updateChecklist(object.id, updated);
      setObject((prev) => prev ? { ...prev, checklist: updated } : prev);
      setNewCheckItem('');
    } catch {
      toast.error('Fehler beim Hinzufügen.');
    }
  };

  const toggleCheck = async (itemId: string) => {
    if (!object) return;
    const updated = object.checklist.map((c) =>
      c.id === itemId ? { ...c, done: !c.done } : c
    );
    await updateChecklist(object.id, updated);
    setObject((prev) => prev ? { ...prev, checklist: updated } : prev);
  };

  const removeCheckItem = async (itemId: string) => {
    if (!object) return;
    const updated = object.checklist.filter((c) => c.id !== itemId);
    await updateChecklist(object.id, updated);
    setObject((prev) => prev ? { ...prev, checklist: updated } : prev);
  };

  const doneCount = object?.checklist.filter((c) => c.done).length ?? 0;
  const checklistPct = object?.checklist.length
    ? Math.round((doneCount / object.checklist.length) * 100)
    : 0;

  return {
    object,
    loading,
    tab,
    setTab,
    showEditModal,
    setShowEditModal,
    newMaterial,
    setNewMaterial,
    newCheckItem,
    setNewCheckItem,
    handleUpdate,
    handleDelete,
    addMaterial,
    updateMaterialStatus,
    removeMaterial,
    addCheckItem,
    toggleCheck,
    removeCheckItem,
    doneCount,
    checklistPct,
  };
};
