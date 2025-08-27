import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    resources: {
      en: {
        translation: {
          // Navigation
          'nav.dashboard': 'Dashboard',
          'nav.complaints': 'Complaints',
          'nav.leave': 'Leave',
          'nav.mess': 'Mess',
          'nav.notifications': 'Notifications',
          'nav.profile': 'Profile',
          'nav.events': 'Events',
          'nav.preferences': 'Preferences',

          // Common
          'common.save': 'Save',
          'common.cancel': 'Cancel',
          'common.delete': 'Delete',
          'common.edit': 'Edit',
          'common.view': 'View',
          'common.loading': 'Loading...',
          'common.error': 'Error',
          'common.success': 'Success',
          'common.confirm': 'Confirm',
          'common.search': 'Search',
          'common.filter': 'Filter',
          'common.sort': 'Sort',
          'common.export': 'Export',
          'common.import': 'Import',

          // Dashboard
          'dashboard.title': 'Dashboard',
          'dashboard.welcome': 'Welcome to Hostel Management',
          'dashboard.stats': 'Statistics',
          'dashboard.recentActivity': 'Recent Activity',
          'dashboard.quickActions': 'Quick Actions',

          // Complaints
          'complaints.title': 'Complaints',
          'complaints.new': 'New Complaint',
          'complaints.view': 'View Complaints',
          'complaints.status': 'Status',
          'complaints.priority': 'Priority',
          'complaints.category': 'Category',
          'complaints.description': 'Description',
          'complaints.attachments': 'Attachments',
          'complaints.submit': 'Submit Complaint',
          'complaints.resolve': 'Resolve',
          'complaints.pending': 'Pending',
          'complaints.inProgress': 'In Progress',
          'complaints.resolved': 'Resolved',
          'complaints.rejected': 'Rejected',

          // Events
          'events.title': 'Events',
          'events.create': 'Create Event',
          'events.view': 'View Events',
          'events.calendar': 'Calendar View',
          'events.title_field': 'Title',
          'events.description': 'Description',
          'events.startDate': 'Start Date',
          'events.endDate': 'End Date',
          'events.location': 'Location',
          'events.type': 'Type',

          // Preferences
          'preferences.title': 'Preferences',
          'preferences.appearance': 'Appearance',
          'preferences.theme': 'Theme',
          'preferences.language': 'Language',
          'preferences.timezone': 'Timezone',
          'preferences.notifications': 'Notifications',
          'preferences.dashboard': 'Dashboard Layout',
          'preferences.save': 'Save Preferences',
          'preferences.reset': 'Reset to Defaults',

          // Auth
          'auth.login': 'Login',
          'auth.logout': 'Logout',
          'auth.email': 'Email',
          'auth.password': 'Password',
          'auth.forgotPassword': 'Forgot Password?',
          'auth.signIn': 'Sign In',
          'auth.signUp': 'Sign Up',

          // Messages
          'message.saved': 'Changes saved successfully',
          'message.error': 'An error occurred',
          'message.confirmDelete': 'Are you sure you want to delete this item?',
          'message.noData': 'No data available',
          'message.loading': 'Loading...',
        }
      },
      hi: {
        translation: {
          // Navigation
          'nav.dashboard': 'डैशबोर्ड',
          'nav.complaints': 'शिकायतें',
          'nav.leave': 'अवकाश',
          'nav.mess': 'मेस',
          'nav.notifications': 'सूचनाएं',
          'nav.profile': 'प्रोफ़ाइल',
          'nav.events': 'घटनाएं',
          'nav.preferences': 'प्राथमिकताएं',

          // Common
          'common.save': 'सेव करें',
          'common.cancel': 'रद्द करें',
          'common.delete': 'मिटाएं',
          'common.edit': 'संपादित करें',
          'common.view': 'देखें',
          'common.loading': 'लोड हो रहा है...',
          'common.error': 'त्रुटि',
          'common.success': 'सफलता',
          'common.confirm': 'पुष्टि करें',
          'common.search': 'खोजें',
          'common.filter': 'फ़िल्टर',
          'common.sort': 'क्रमबद्ध करें',
          'common.export': 'निर्यात',
          'common.import': 'आयात',

          // Dashboard
          'dashboard.title': 'डैशबोर्ड',
          'dashboard.welcome': 'हॉस्टल प्रबंधन में आपका स्वागत है',
          'dashboard.stats': 'आंकड़े',
          'dashboard.recentActivity': 'हाल की गतिविधि',
          'dashboard.quickActions': 'त्वरित कार्य',

          // Complaints
          'complaints.title': 'शिकायतें',
          'complaints.new': 'नई शिकायत',
          'complaints.view': 'शिकायतें देखें',
          'complaints.status': 'स्थिति',
          'complaints.priority': 'प्राथमिकता',
          'complaints.category': 'श्रेणी',
          'complaints.description': 'विवरण',
          'complaints.attachments': 'अनुलग्नक',
          'complaints.submit': 'शिकायत दर्ज करें',
          'complaints.resolve': 'हल करें',
          'complaints.pending': 'लंबित',
          'complaints.inProgress': 'प्रगति में',
          'complaints.resolved': 'हल हो गई',
          'complaints.rejected': 'अस्वीकृत',

          // Events
          'events.title': 'घटनाएं',
          'events.create': 'घटना बनाएं',
          'events.view': 'घटनाएं देखें',
          'events.calendar': 'कैलेंडर दृश्य',
          'events.title_field': 'शीर्षक',
          'events.description': 'विवरण',
          'events.startDate': 'प्रारंभ तिथि',
          'events.endDate': 'समाप्ति तिथि',
          'events.location': 'स्थान',
          'events.type': 'प्रकार',

          // Preferences
          'preferences.title': 'प्राथमिकताएं',
          'preferences.appearance': 'दिखावट',
          'preferences.theme': 'थीम',
          'preferences.language': 'भाषा',
          'preferences.timezone': 'समय क्षेत्र',
          'preferences.notifications': 'सूचनाएं',
          'preferences.dashboard': 'डैशबोर्ड लेआउट',
          'preferences.save': 'प्राथमिकताएं सेव करें',
          'preferences.reset': 'डिफ़ॉल्ट पर रीसेट करें',

          // Auth
          'auth.login': 'लॉगिन',
          'auth.logout': 'लॉगआउट',
          'auth.email': 'ईमेल',
          'auth.password': 'पासवर्ड',
          'auth.forgotPassword': 'पासवर्ड भूल गए?',
          'auth.signIn': 'साइन इन करें',
          'auth.signUp': 'साइन अप करें',

          // Messages
          'message.saved': 'परिवर्तन सफलतापूर्वक सेव किए गए',
          'message.error': 'एक त्रुटि हुई',
          'message.confirmDelete': 'क्या आप वाकई इस आइटम को मिटाना चाहते हैं?',
          'message.noData': 'कोई डेटा उपलब्ध नहीं',
          'message.loading': 'लोड हो रहा है...',
        }
      }
    }
  })

export default i18n
