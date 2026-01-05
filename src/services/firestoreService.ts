// src/services/firestoreService.ts
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";

import { db } from "./firebase";
import { FoodDonation } from "../types";

/* ---------------- ADD DONATION ---------------- */
export const addDonation = async (donation: FoodDonation) => {
  await addDoc(collection(db, "donations"), {
    ...donation,
    status: "available",
    acceptedBy: "",
    createdAt: serverTimestamp(),
  });
};

/* ---------------- GET ALL DONATIONS (NGO) ---------------- */
export const getDonations = async (): Promise<FoodDonation[]> => {
  const snapshot = await getDocs(collection(db, "donations"));

  return snapshot.docs.map((docSnap) => ({
    ...(docSnap.data() as FoodDonation),
    id: docSnap.id,
  }));
};

/* ---------------- GET DONATIONS BY PROVIDER ---------------- */
export const getDonationsByProvider = async (
  providerId: string
): Promise<FoodDonation[]> => {
  const q = query(
    collection(db, "donations"),
    where("providerId", "==", providerId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    ...(docSnap.data() as FoodDonation),
    id: docSnap.id,
  }));
};

/* ---------------- NGO ACCEPTS DONATION ---------------- */
export const acceptDonation = async (
  donationId: string,
  ngoName: string
) => {
  const ref = doc(db, "donations", donationId);

  await updateDoc(ref, {
    status: "accepted",
    acceptedBy: ngoName,
  });
};
