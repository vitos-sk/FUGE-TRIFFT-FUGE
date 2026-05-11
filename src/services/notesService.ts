import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  updateDoc,
  doc,
  increment,
  writeBatch,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Note, NoteTag } from '../types';

export const subscribeToNotes = (
  objectId: string,
  onData: (notes: Note[]) => void,
  onError?: (e: Error) => void
) => {
  const q = query(
    collection(db, 'objects', objectId, 'notes'),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(
    q,
    (snap) => {
      const notes = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Note));
      onData(notes);
    },
    onError
  );
};

export const addNote = async (
  objectId: string,
  text: string,
  tag: NoteTag,
  authorId: string,
  authorName: string,
  objectTitle?: string
) => {
  const now = Timestamp.now();
  const noteRef = await addDoc(collection(db, 'objects', objectId, 'notes'), {
    text,
    tag,
    authorId,
    authorName,
    createdAt: now,
  });

  await updateDoc(doc(db, 'objects', objectId), {
    lastNoteText: text,
    lastNoteAt: now,
    lastNoteAuthor: authorName,
    noteCount: increment(1),
  });

  // Notify all other users about the new note
  try {
    const usersSnap = await getDocs(collection(db, 'users'));
    const batch = writeBatch(db);
    const title = objectTitle ? `Neue Notiz — ${objectTitle}` : 'Neue Notiz';
    const body = `${authorName}: ${text.length > 90 ? text.slice(0, 90) + '…' : text}`;

    usersSnap.docs.forEach((userDoc) => {
      if (userDoc.id === authorId) return; // don't notify the author
      const notifRef = doc(collection(db, 'notifications', userDoc.id, 'items'));
      batch.set(notifRef, {
        title,
        body,
        objectId,
        read: false,
        createdAt: now,
      });
    });

    await batch.commit();
  } catch (err) {
    // Notification failure must never block the note save
    console.error('[notesService] failed to send notifications:', err);
  }

  return noteRef;
};
