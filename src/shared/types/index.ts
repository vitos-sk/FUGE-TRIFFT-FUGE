import { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'worker';

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Timestamp;
  fcmToken?: string;
  disabled?: boolean;
}

export interface Material {
  id: string;
  name: string;
  status: 'needed' | 'ordered' | 'delivered';
}

export interface CRMObject {
  id: string;
  title: string;
  address: string;
  city: string;
  deadline: Timestamp | null;
  whatsappLink?: string;
  createdBy: string;
  createdAt: Timestamp;
  lastNoteText?: string;
  lastNoteAt?: Timestamp | null;
  lastNoteAuthor?: string;
  noteCount?: number;
  lastActivityAt?: Timestamp | null;
  materials: Material[];
  archived?: boolean;
  archivedAt?: Timestamp | null;
}

export type NoteTag = 'material' | 'garbage' | 'problem' | 'delivery' | 'general';

export interface Note {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  tag: NoteTag;
  createdAt: Timestamp;
}

export interface Photo {
  id: string;
  url: string;
  storagePath?: string;
  caption: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: Timestamp;
}

export interface PhotoComparison {
  id: string;
  beforeUrl: string;
  afterUrl: string;
  createdBy: string;
  createdByName: string;
  createdAt: Timestamp;
}

export interface WorkHourEntry {
  id: string;
  userId: string;
  userName: string;
  objectId?: string | null;
  objectTitle?: string;
  date: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  totalMinutes: number;
  createdAt: Timestamp;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  objectId?: string;
  photoId?: string;
  noteId?: string;
  read: boolean;
  createdAt: Timestamp;
}

