
export interface Email {
  id: string;
  from: {
    name: string;
    email: string;
  };
  to: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  starred: boolean;
  labels: string[];
  hasAttachments: boolean;
}

export const emails: Email[] = [
  {
    id: "1",
    from: {
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com"
    },
    to: "user@example.com",
    subject: "Weekly Team Update - Project Progress",
    body: `Hi Team,

I hope this email finds you well. I wanted to share our progress from last week and outline our goals for the upcoming week.

Key Accomplishments:
- Completed the user research phase
- Finalized the initial wireframes
- Started development on the core features

Goals for This Week:
- Begin user testing on wireframes
- Continue development of core features
- Schedule the mid-project review

Please let me know if you have any questions or need clarification on any of these items.

Best regards,
Sarah`,
    date: "2023-10-15T09:24:00",
    read: false,
    starred: true,
    labels: ["Work", "Important"],
    hasAttachments: false
  },
  {
    id: "2",
    from: {
      name: "Michael Chen",
      email: "michael.chen@example.com"
    },
    to: "user@example.com",
    subject: "Invitation: Design Workshop Next Thursday",
    body: `Hello,

I'd like to invite you to our upcoming design workshop scheduled for next Thursday from 2-4 PM. During this session, we'll be exploring new interface concepts for the mobile application.

What to Expect:
- Hands-on design activities
- Collaborative brainstorming
- Feedback on current prototypes

Please confirm your attendance by the end of the day tomorrow. If you have any specific topics you'd like to discuss during the workshop, feel free to share them with me beforehand.

Looking forward to your participation!

Best,
Michael Chen
UX Design Lead`,
    date: "2023-10-14T16:45:00",
    read: true,
    starred: false,
    labels: ["Work", "Design"],
    hasAttachments: true
  },
  {
    id: "3",
    from: {
      name: "Amazon",
      email: "orders@amazon.com"
    },
    to: "user@example.com",
    subject: "Your Amazon Order #302-5982741-4590672 Has Shipped",
    body: `Hello,

Your recent Amazon order has shipped and is on its way to you!

Order Details:
- Order #302-5982741-4590672
- Estimated delivery: October 18, 2023
- Tracking number: TRK82947165390

You can track your package at any time by clicking the tracking link in your account.

Thank you for shopping with Amazon!

The Amazon Team`,
    date: "2023-10-14T10:12:00",
    read: true,
    starred: false,
    labels: ["Shopping"],
    hasAttachments: false
  },
  {
    id: "4",
    from: {
      name: "Dr. Emily Rodriguez",
      email: "e.rodriguez@medical.org"
    },
    to: "user@example.com",
    subject: "Appointment Confirmation - October 20",
    body: `Dear Patient,

This is a confirmation of your upcoming appointment with Dr. Emily Rodriguez on October 20, 2023, at 10:30 AM.

Location: Medical Center, 123 Health Avenue, Suite 301

Please arrive 15 minutes early to complete any necessary paperwork. Remember to bring your insurance card and a list of any current medications.

If you need to reschedule or have any questions, please call our office at (555) 123-4567.

Regards,
Medical Center Staff`,
    date: "2023-10-13T14:30:00",
    read: false,
    starred: true,
    labels: ["Personal", "Health"],
    hasAttachments: false
  },
  {
    id: "5",
    from: {
      name: "LinkedIn",
      email: "notifications@linkedin.com"
    },
    to: "user@example.com",
    subject: "5 New Job Recommendations for You",
    body: `Hello,

Based on your profile and preferences, we've found 5 new job opportunities that might interest you:

1. UX Designer at TechCorp
2. Product Manager at InnovateSoft
3. UI Developer at CreativeDesigns
4. User Researcher at DataInsights
5. Interaction Designer at MobileFirst

Click on any job title to learn more and apply directly from your LinkedIn profile.

LinkedIn Team`,
    date: "2023-10-12T08:45:00",
    read: true,
    starred: false,
    labels: ["Work"],
    hasAttachments: false
  },
  {
    id: "6",
    from: {
      name: "Alex Thompson",
      email: "alex.t@friendmail.com"
    },
    to: "user@example.com",
    subject: "Weekend Plans and Dinner Invitation",
    body: `Hey there!

Hope you've been having a great week! I was wondering if you'd like to join us for dinner this Saturday around 7 PM. We're planning to try that new restaurant downtown that everyone's been talking about.

A few of us are meeting up, and it would be great if you could make it too. Let me know if you're available and if you'd like to bring anyone along.

Looking forward to catching up!

Cheers,
Alex`,
    date: "2023-10-11T19:20:00",
    read: false,
    starred: true,
    labels: ["Personal", "Friends"],
    hasAttachments: false
  },
  {
    id: "7",
    from: {
      name: "Bank of America",
      email: "statements@bofa.com"
    },
    to: "user@example.com",
    subject: "Your Monthly Statement is Ready",
    body: `Dear Valued Customer,

Your monthly statement for account ending in ****4567 is now available for viewing online.

Statement Period: September 1 - September 30, 2023

To view your complete statement, please log in to your online banking account. If you notice any unauthorized transactions, please contact our customer service team immediately at 1-800-123-4567.

Thank you for banking with Bank of America.

This is an automated message. Please do not reply to this email.`,
    date: "2023-10-11T07:15:00",
    read: true,
    starred: false,
    labels: ["Finance"],
    hasAttachments: true
  },
  {
    id: "8",
    from: {
      name: "Coursera",
      email: "no-reply@coursera.org"
    },
    to: "user@example.com",
    subject: "Complete Your Course: 2 Weeks Left",
    body: `Hello,

This is a friendly reminder that your course "Introduction to User Experience Design" will be ending in 2 weeks. You've completed 65% of the course content so far.

To earn your certificate, you'll need to:
- Complete the remaining video lectures
- Submit the final assignment
- Take the course completion quiz

You're doing great so far! Keep up the good work and finish strong.

The Coursera Team`,
    date: "2023-10-10T13:50:00",
    read: false,
    starred: false,
    labels: ["Education"],
    hasAttachments: false
  }
];

export const folders = [
  { id: "inbox", name: "Inbox", count: 4 },
  { id: "starred", name: "Starred", count: 3 },
  { id: "sent", name: "Sent", count: 0 },
  { id: "drafts", name: "Drafts", count: 2 },
  { id: "spam", name: "Spam", count: 1 },
  { id: "trash", name: "Trash", count: 0 }
];

export const labels = [
  { id: "work", name: "Work", color: "#0B57D0" },
  { id: "personal", name: "Personal", color: "#188038" },
  { id: "finance", name: "Finance", color: "#EA4335" },
  { id: "shopping", name: "Shopping", color: "#9334E6" },
  { id: "health", name: "Health", color: "#EA8600" },
  { id: "education", name: "Education", color: "#1967D2" },
  { id: "friends", name: "Friends", color: "#D93025" },
  { id: "important", name: "Important", color: "#D23F31" },
  { id: "design", name: "Design", color: "#16A765" }
];

export const getEmailById = (id: string): Email | undefined => {
  return emails.find(email => email.id === id);
};

export const getUnreadCount = (): number => {
  return emails.filter(email => !email.read).length;
};

export const getEmailsByFolder = (folderId: string): Email[] => {
  switch(folderId) {
    case "inbox":
      return emails;
    case "starred":
      return emails.filter(email => email.starred);
    case "sent":
      return [];
    case "drafts":
      return [];
    case "spam":
      return [];
    case "trash":
      return [];
    default:
      return [];
  }
};

export const getEmailsByLabel = (labelId: string): Email[] => {
  return emails.filter(email => email.labels.includes(
    labels.find(label => label.id === labelId)?.name || ""
  ));
};
