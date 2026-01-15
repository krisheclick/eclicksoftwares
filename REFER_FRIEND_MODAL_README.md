# Refer a Friend Modal - Implementation Guide

## Overview
A fully-featured "Refer a Friend" modal for the Careers page that allows users to refer job candidates. The modal captures candidate information, referrer information, and a resume file upload.

## Features
✅ **Form Fields**
- Candidate Name (required)
- Candidate Email (required, validated)
- About the Candidate (required, min 20 characters)
- Referrer Name (required)
- Referrer Email (required, validated)
- Resume/CV Upload (required, PDF/DOC/DOCX, max 5MB)

✅ **Functionality**
- Form validation with real-time error feedback
- File upload support (PDF, DOC, DOCX)
- Success/error notifications
- Auto-close modal on successful submission
- Form reset after submission
- Responsive design (mobile, tablet, desktop)
- Same design as lets-connect modal

✅ **API Integration**
- Endpoint: `{NEXT_PUBLIC_API_URL}/careers/refer-apply`
- Method: POST (multipart/form-data for file upload)
- Fields: candidate_name, candidate_email, about_the_candidate, referrer_name, referrer_email, refer_resume_path

## File Structure

```
components/
  careers/
    ReferAFriendModal.tsx         # Modal component
    ReferAFriendModal.module.css  # Modal styling
  career/
    Careers.tsx                   # Updated with modal integration

context/
  ThemeContext.tsx               # Updated with showReferModal state

utils/
  useLetsConnect.tsx             # Updated with useReferModal hook
```

## Components

### ReferAFriendModal.tsx
Main modal component with:
- Form state management
- Validation logic
- File upload handling
- API submission
- Error/success handling

**Props:**
```typescript
interface ReferAFriendModalProps {
    show: boolean;           // Modal visibility
    onHide: () => void;     // Close handler
    title?: string;         // Modal title (default: "Refer a Friend")
}
```

**Form Data:**
```typescript
interface ReferFormData {
    candidate_name: string;
    candidate_email: string;
    about_the_candidate: string;
    referrer_name: string;
    referrer_email: string;
    refer_resume_path: File | null;
}
```

## Usage

### 1. Using the Hook
```typescript
import { useReferModal } from '@/utils/useLetsConnect';

export default function MyComponent() {
    const { openReferModal, showReferModal, setShowReferModal } = useReferModal();

    return (
        <>
            <button onClick={openReferModal}>Refer a Friend</button>
            <ReferAFriendModal 
                show={showReferModal}
                onHide={() => setShowReferModal(false)}
            />
        </>
    );
}
```

### 2. In Careers Component
Already integrated! The "Refer a Friend" button is available in the Job Vacancies section.

## Validation Rules

| Field | Rule |
|-------|------|
| Candidate Name | 2-100 characters, required |
| Candidate Email | Valid email format, required |
| About Candidate | 20+ characters, required |
| Referrer Name | 2-100 characters, required |
| Referrer Email | Valid email format, required |
| Resume File | PDF/DOC/DOCX, max 5MB, required |

## Styling

The modal uses the same design as the lets-connect modal:
- Color scheme: Purple gradient for submit button (#667eea to #764ba2)
- Border color: #dfe6e9 (light gray)
- Focus shadow: Purple with 0.15 opacity
- Responsive breakpoints: 768px (tablet), 576px (mobile)

## API Endpoint

**URL:** `{NEXT_PUBLIC_API_URL}/careers/refer-apply`

**Method:** POST

**Content-Type:** multipart/form-data

**Request Body:**
```json
{
    "candidate_name": "Rahul Pal",
    "candidate_email": "rahul@gmail.com",
    "about_the_candidate": "Excellent React developer with 5+ years experience",
    "referrer_name": "Subhadip Pal",
    "referrer_email": "subhadipp295@gmail.com",
    "refer_resume_path": "<File object>"
}
```

**Success Response:**
```json
{
    "status": true,
    "response_message": {
        "msg": "Thank you for the referral!"
    }
}
```

**Error Response:**
```json
{
    "status": false,
    "response_message": {
        "msg": "Error message"
    }
}
```

## State Management

### ThemeContext
Modal state is stored globally:
```typescript
showReferModal: boolean;
setShowReferModal: (show: boolean) => void;
```

### useReferModal Hook
Provides convenient methods to manage modal:
```typescript
const { openReferModal, closeReferModal, showReferModal, setShowReferModal } = useReferModal();
```

## Error Handling

- **Form Validation Errors:** Displayed inline under each field
- **API Errors:** Shown as alert message at top of modal
- **File Upload Errors:** Validated for type and size before submission
- **Network Errors:** Generic error message displayed

## Auto-close Behavior
- Modal automatically closes 2 seconds after successful submission
- User can manually close at any time using the X button or Cancel button
- Form is reset when modal closes

## Responsive Design

| Breakpoint | Changes |
|------------|---------|
| Desktop (>768px) | 2-column layout for name/email fields |
| Tablet (≤768px) | 650px modal width, full-width buttons |
| Mobile (≤576px) | Adjusted padding, stacked buttons |

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- File upload support required
- FormData API support required

## Accessibility Features
- Semantic HTML structure
- ARIA labels on close button
- Keyboard navigation support
- Focus management
- Error announcements

## Future Enhancements
- Drag-and-drop file upload
- Multiple file attachments
- Save referral as draft
- Email notifications
- Referral tracking dashboard
