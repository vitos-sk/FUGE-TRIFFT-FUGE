import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiMapPin, FiX } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { Tabs } from '../components/ui/Tabs';
import { NotesFeed } from '../components/notes/NotesFeed';
import { PhotoGrid } from '../components/photos/PhotoGrid';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { ObjectForm } from '../components/objects/ObjectForm';
import { Spinner } from '../components/ui/Spinner';
import { useToast } from '../components/ui/Toast';
import { useConfirm } from '../components/ui/ConfirmDialog';
import { getObject, updateObject, deleteObject, updateMaterials, updateChecklist } from '../services/objectsService';
import { useAuth } from '../hooks/useAuth';
import type { CRMObject, Material, ChecklistItem, TabId } from '../types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 22px;
  transition: color ${({ theme }) => theme.transitions.fast};
  font-weight: 500;
  &:hover { color: ${({ theme }) => theme.colors.textSecondary}; }
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.01em;
  line-height: 1.25;
`;

const Meta = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 5px;
  line-height: 1.4;
  display: flex;
  align-items: center;
`;

const TabContent = styled.div`
  padding: 22px 0;
`;

const MaterialList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 18px;
`;

const MaterialItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 16px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  transition: border-color ${({ theme }) => theme.transitions.fast};
  &:hover { border-color: ${({ theme }) => theme.colors.borderHover}; }
`;

const MatName = styled.span`
  flex: 1;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 500;
`;

const CheckList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 18px;
`;

const CheckItem = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover { background: ${({ theme }) => theme.colors.bgElevated}; border-color: ${({ theme }) => theme.colors.borderHover}; }
`;

const CheckText = styled.span<{ $done: boolean }>`
  flex: 1;
  font-size: 14px;
  color: ${({ $done, theme }) => ($done ? theme.colors.textMuted : theme.colors.textPrimary)};
  text-decoration: ${({ $done }) => ($done ? 'line-through' : 'none')};
  line-height: 1.4;
  transition: all 0.2s;
`;

const CheckProgressBar = styled.div<{ $pct: number }>`
  height: 4px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 9999px;
  margin-bottom: 16px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ $pct }) => $pct}%;
    background: ${({ theme }) => theme.colors.success};
    border-radius: 9999px;
    transition: width 0.4s ease;
  }
`;

const CheckProgressLabel = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 24px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const InfoItem = styled.div`
  padding: 14px 16px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadiusSm};
`;

const InfoLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
`;

const InfoValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 500;
`;

const AddRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const DangerZone = styled.div`
  margin-top: 32px;
  padding-top: 22px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DangerTitle = styled.p`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
`;

const EmptyText = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  padding: 16px 0;
`;

const TABS = [
  { id: 'notes',     label: 'Notizen' },
  { id: 'photos',    label: 'Fotos' },
  { id: 'material',  label: 'Material' },
  { id: 'checklist', label: 'Checkliste' },
  { id: 'info',      label: 'Info' },
];

const statusLabels: Record<string, string> = {
  new: 'Neu', in_progress: 'In Arbeit', paused: 'Pausiert', done: 'Fertig',
};

const ObjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [object, setObject] = useState<CRMObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabId>('notes');
  const [showEditModal, setShowEditModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState('');
  const [newCheckItem, setNewCheckItem] = useState('');
  const toast = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    if (!id) return;
    getObject(id)
      .then((obj) => {
        if (obj) {
          obj.materials = obj.materials ?? [];
          obj.checklist = obj.checklist ?? [];
        }
        setObject(obj);
        setLoading(false);
      })
      .catch(() => { toast.error('Objekt konnte nicht geladen werden.'); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
        <Spinner size={32} />
      </div>
    );
  }

  if (!object) {
    return <EmptyText style={{ padding: 40 }}>Objekt nicht gefunden.</EmptyText>;
  }

  const handleUpdate = async (data: Partial<CRMObject>) => {
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
      navigate('/');
    } catch {
      toast.error('Fehler beim Löschen.');
    }
  };

  const addMaterial = async () => {
    if (!newMaterial.trim()) return;
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
    const updated = object.materials.map((m) => m.id === matId ? { ...m, status } : m);
    try {
      await updateMaterials(object.id, updated);
      setObject((prev) => prev ? { ...prev, materials: updated } : prev);
    } catch {
      toast.error('Fehler beim Aktualisieren.');
    }
  };

  const removeMaterial = async (matId: string) => {
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
    if (!newCheckItem.trim()) return;
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
    const updated = object.checklist.map((c) =>
      c.id === itemId ? { ...c, done: !c.done } : c
    );
    await updateChecklist(object.id, updated);
    setObject((prev) => prev ? { ...prev, checklist: updated } : prev);
  };

  const removeCheckItem = async (itemId: string) => {
    const updated = object.checklist.filter((c) => c.id !== itemId);
    await updateChecklist(object.id, updated);
    setObject((prev) => prev ? { ...prev, checklist: updated } : prev);
  };

  const doneCount = object.checklist.filter((c) => c.done).length;
  const checklistPct = object.checklist.length > 0
    ? Math.round((doneCount / object.checklist.length) * 100)
    : 0;

  return (
    <>
      <BackLink to="/">← Zurück zur Übersicht</BackLink>

      <PageHeader>
        <TitleRow>
          <div>
            <Title>{object.title}</Title>
            <Meta><FiMapPin size={12} style={{ marginRight: 5, flexShrink: 0 }} />{object.address}, {object.city}</Meta>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <Badge status={object.status}>{statusLabels[object.status]}</Badge>
          </div>
        </TitleRow>
      </PageHeader>

      <Tabs tabs={TABS} activeTab={tab} onChange={(t) => setTab(t as TabId)} />

      <TabContent>
        {tab === 'notes' && <NotesFeed objectId={object.id} objectTitle={object.title} />}

        {tab === 'photos' && <PhotoGrid objectId={object.id} />}

        {tab === 'material' && (
          <div>
            <MaterialList>
              {object.materials.length === 0 && (
                <EmptyText>Keine Materialien eingetragen.</EmptyText>
              )}
              {object.materials.map((mat) => (
                <MaterialItem key={mat.id}>
                  <MatName>{mat.name}</MatName>
                  <Select
                    value={mat.status}
                    onChange={(e) => updateMaterialStatus(mat.id, e.target.value as Material['status'])}
                    style={{ width: 'auto', minWidth: 120 }}
                  >
                    <option value="needed">Benötigt</option>
                    <option value="ordered">Bestellt</option>
                    <option value="delivered">Geliefert</option>
                  </Select>
                  {isAdmin && (
                    <Button $variant="ghost" $size="sm" onClick={() => removeMaterial(mat.id)}
                      style={{ color: '#c0392b', flexShrink: 0 }}><FiX size={14} /></Button>
                  )}
                </MaterialItem>
              ))}
            </MaterialList>
            {isAdmin && (
              <AddRow>
                <Input
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  placeholder="Material hinzufügen…"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
                />
                <Button onClick={addMaterial} disabled={!newMaterial.trim()} style={{ flexShrink: 0 }}>
                  + Hinzufügen
                </Button>
              </AddRow>
            )}
          </div>
        )}

        {tab === 'checklist' && (
          <div>
            {object.checklist.length > 0 && (
              <>
                <CheckProgressLabel>
                  {doneCount} / {object.checklist.length} erledigt ({checklistPct}%)
                </CheckProgressLabel>
                <CheckProgressBar $pct={checklistPct} />
              </>
            )}
            <CheckList>
              {object.checklist.length === 0 && (
                <EmptyText>Keine Aufgaben in der Checkliste.</EmptyText>
              )}
              {object.checklist.map((item) => (
                <CheckItem key={item.id}>
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleCheck(item.id)}
                    style={{ accentColor: '#22a35a', width: 17, height: 17, cursor: 'pointer', flexShrink: 0 }}
                  />
                  <CheckText $done={item.done}>{item.text}</CheckText>
                  {isAdmin && (
                    <Button $variant="ghost" $size="sm" onClick={() => removeCheckItem(item.id)}
                      style={{ color: '#777', flexShrink: 0 }}><FiX size={14} /></Button>
                  )}
                </CheckItem>
              ))}
            </CheckList>
            {isAdmin && (
              <AddRow>
                <Input
                  value={newCheckItem}
                  onChange={(e) => setNewCheckItem(e.target.value)}
                  placeholder="Aufgabe hinzufügen…"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCheckItem())}
                />
                <Button onClick={addCheckItem} disabled={!newCheckItem.trim()} style={{ flexShrink: 0 }}>
                  + Hinzufügen
                </Button>
              </AddRow>
            )}
          </div>
        )}

        {tab === 'info' && (
          <div>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Objektname</InfoLabel>
                <InfoValue>{object.title}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Status</InfoLabel>
                <InfoValue>
                  <Badge status={object.status}>{statusLabels[object.status]}</Badge>
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Adresse</InfoLabel>
                <InfoValue>{object.address}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Stadt</InfoLabel>
                <InfoValue>{object.city}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Deadline</InfoLabel>
                <InfoValue>
                  {object.deadline?.toDate?.()
                    ? format(object.deadline.toDate(), 'dd.MM.yyyy', { locale: de })
                    : '—'}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Erstellt</InfoLabel>
                <InfoValue>
                  {object.createdAt?.toDate?.()
                    ? format(object.createdAt.toDate(), 'dd.MM.yyyy', { locale: de })
                    : '—'}
                </InfoValue>
              </InfoItem>
            </InfoGrid>

            {isAdmin && (
              <>
                <Button onClick={() => setShowEditModal(true)}>Bearbeiten</Button>
                <DangerZone>
                  <DangerTitle>Gefahrenzone</DangerTitle>
                  <Button $variant="danger" onClick={handleDelete}>
                    Objekt löschen
                  </Button>
                </DangerZone>
              </>
            )}
          </div>
        )}
      </TabContent>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Objekt bearbeiten">
        <ObjectForm
          initial={object}
          onSubmit={handleUpdate}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

    </>
  );
};

export default ObjectDetailPage;
