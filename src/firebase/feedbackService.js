// Firebase Feedback Service
// Handles all Firebase operations for used feedbacks

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

const COLLECTION_NAME = 'usedFeedbacks';

// Get all used feedback IDs
export const getUsedFeedbacks = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const usedFeedbacks = [];

    querySnapshot.forEach((doc) => {
      usedFeedbacks.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return usedFeedbacks;
  } catch (error) {
    console.error('Error getting used feedbacks:', error);
    return [];
  }
};

// Mark a feedback as used
export const markFeedbackAsUsed = async (feedbackId, feedbackText) => {
  try {
    await setDoc(doc(db, COLLECTION_NAME, feedbackId.toString()), {
      feedbackId: feedbackId,
      feedbackText: feedbackText,
      markedAt: serverTimestamp(),
      markedDate: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error marking feedback as used:', error);
    return { success: false, error: error.message };
  }
};

// Restore a feedback (remove from used list)
export const restoreFeedback = async (feedbackId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, feedbackId.toString()));
    return { success: true };
  } catch (error) {
    console.error('Error restoring feedback:', error);
    return { success: false, error: error.message };
  }
};

// Subscribe to real-time updates
export const subscribeToUsedFeedbacks = (callback) => {
  const unsubscribe = onSnapshot(
    collection(db, COLLECTION_NAME),
    (snapshot) => {
      const usedFeedbacks = [];
      snapshot.forEach((doc) => {
        usedFeedbacks.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(usedFeedbacks);
    },
    (error) => {
      console.error('Error subscribing to used feedbacks:', error);
    }
  );

  return unsubscribe;
};

// Get statistics
export const getStatistics = async () => {
  try {
    const usedFeedbacks = await getUsedFeedbacks();

    // Count by category
    const dentalCount = usedFeedbacks.filter(f =>
      f.feedbackText?.toLowerCase().includes('dental')
    ).length;

    const physioCount = usedFeedbacks.filter(f =>
      f.feedbackText?.toLowerCase().includes('physio') ||
      f.feedbackText?.toLowerCase().includes('therapy')
    ).length;

    // Count this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const thisWeekCount = usedFeedbacks.filter(f => {
      const markedDate = new Date(f.markedDate);
      return markedDate >= oneWeekAgo;
    }).length;

    // Count this month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const thisMonthCount = usedFeedbacks.filter(f => {
      const markedDate = new Date(f.markedDate);
      return markedDate >= oneMonthAgo;
    }).length;

    return {
      total: usedFeedbacks.length,
      dental: dentalCount,
      physio: physioCount,
      thisWeek: thisWeekCount,
      thisMonth: thisMonthCount,
      recent: usedFeedbacks
        .sort((a, b) => new Date(b.markedDate) - new Date(a.markedDate))
        .slice(0, 10)
    };
  } catch (error) {
    console.error('Error getting statistics:', error);
    return {
      total: 0,
      dental: 0,
      physio: 0,
      thisWeek: 0,
      thisMonth: 0,
      recent: []
    };
  }
};
