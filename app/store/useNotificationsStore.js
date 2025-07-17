import { create } from 'zustand';
import { request } from '../util/request'; // Adjust the path if needed

export const useNotificationsStore = create((set) => ({
  emails: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async () => {
    set({ loading: true, error: null });

    try {
      const data = await request('/notifications', 'GET'); // Your API endpoint

      const formattedEmails = data.map((notif) => {
        const dataField = notif.data || {};

        return {
          id: notif.id,
          data: dataField, // 👈 Preserve full data object for detailed view
          sender: dataField.name || 'Unknown User',
          subject: dataField.message || 'No subject',
          time: new Date(notif.created_at).toLocaleTimeString(),
          created_at: notif.created_at,
          isStarred: false,
          isRead: notif.read_at !== null, // Better read status check
        };
      });

      const unreadEmails = formattedEmails.filter(email => !email.isRead);

      set({
        emails: formattedEmails,
        unreadCount: unreadEmails.length,
        loading: false,
        error: null,
      });
    } catch (e) {
      console.error('API fetchNotifications error:', e);
      set({
        loading: false,
        error: 'Failed to fetch notifications',
      });
    }
  },

  clearUnreadCount: () => set({ unreadCount: 0 }),

  markEmailRead: (id) => set((state) => {
    const emails = state.emails.map((email) =>
      email.id === id ? { ...email, isRead: true } : email
    );
    const unreadCount = emails.filter(email => !email.isRead).length;

    return { emails, unreadCount };
  }),
}));
