'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, query, where, addDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { getNextColor } from '@/lib/colors';
import { format } from 'date-fns';

export interface Volunteer {
  id: string;
  name: string;
  color: string;
}

export interface ScheduleSlot {
  [time: string]: Omit<Volunteer, 'id'>[];
}

export interface DaySchedule {
  [date: string]: ScheduleSlot;
}

export async function getVolunteers(): Promise<Volunteer[]> {
  try {
    const volunteersCol = collection(db, 'volunteers');
    const snapshot = await getDocs(volunteersCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Volunteer));
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    return [];
  }
}

export async function getScheduleForDate(date: Date): Promise<ScheduleSlot | null> {
  try {
    const dateKey = format(date, "yyyy-MM-dd");
    const scheduleRef = doc(db, 'schedules', dateKey);
    const docSnap = await getDoc(scheduleRef);
    if (docSnap.exists()) {
        return docSnap.data() as ScheduleSlot;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching schedule for ${format(date, "yyyy-MM-dd")}:`, error);
    return null;
  }
}

export async function addVolunteerToSlot(date: Date, time: string, name: string): Promise<Volunteer | null> {
  try {
    const dateKey = format(date, 'yyyy-MM-dd');
    const volunteersCol = collection(db, 'volunteers');
    const q = query(volunteersCol, where('name', '==', name.trim()));
    const snapshot = await getDocs(q);

    let volunteer: Volunteer;
    let volunteerDataForSlot: Omit<Volunteer, 'id'>;

    if (snapshot.empty) {
      const allVolunteers = await getVolunteers();
      const existingColors = allVolunteers.map(v => v.color);
      const newColor = getNextColor(existingColors);
      const newVolunteerData = { name: name.trim(), color: newColor };
      const docRef = await addDoc(volunteersCol, newVolunteerData);
      volunteer = { id: docRef.id, ...newVolunteerData };
      volunteerDataForSlot = newVolunteerData;
    } else {
      const docData = snapshot.docs[0];
      const existingVolunteer = docData.data();
      volunteer = { id: docData.id, ...existingVolunteer } as Volunteer;
      volunteerDataForSlot = { name: volunteer.name, color: volunteer.color };
    }

    const scheduleRef = doc(db, 'schedules', dateKey);
    
    const docSnap = await getDoc(scheduleRef);
    const currentData = docSnap.exists() ? docSnap.data() : {};
    const slotVolunteers = (currentData[time] || []) as Omit<Volunteer, 'id'>[];
    
    const alreadyExists = slotVolunteers.some(v => v.name === volunteerDataForSlot.name);

    if (!alreadyExists) {
        await setDoc(scheduleRef, { 
            [time]: arrayUnion(volunteerDataForSlot) 
        }, { merge: true });
    }

    return volunteer;
  } catch (error) {
    console.error(`Error adding volunteer to slot for ${format(date, 'yyyy-MM-dd')} at ${time}:`, error);
    return null;
  }
}
