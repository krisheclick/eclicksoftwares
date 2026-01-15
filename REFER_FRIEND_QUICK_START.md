# Refer a Friend Modal - Quick Reference

## 🚀 Quick Start

### See the Modal in Action
1. Go to `/career` page
2. Scroll to "Job Vacancies" section
3. Click "Refer a Friend" button (top right)
4. Fill the form and submit

### Use in Any Component
```typescript
import { useReferModal } from '@/utils/useLetsConnect';

export default function MyComponent() {
    const { openReferModal } = useReferModal();
    
    return (
        <button onClick={openReferModal}>
            Refer a Friend
        </button>
    );
}
```

## 📋 Form Fields

1. **Candidate Name** - Full name of the candidate
2. **Candidate Email** - Email address (validated)
3. **About the Candidate** - Why they're a good fit (min 20 chars)
4. **Your Name** - Your full name as referrer
5. **Your Email** - Your email address (validated)
6. **Resume/CV** - Upload PDF, DOC, or DOCX (max 5MB)

## 🔌 API Endpoint

```
POST /careers/refer-apply
Content-Type: multipart/form-data

Fields:
- candidate_name
- candidate_email
- about_the_candidate
- referrer_name
- referrer_email
- refer_resume_path (file)
```

## 📁 Files

| File | Purpose |
|------|---------|
| `components/careers/ReferAFriendModal.tsx` | Modal component |
| `components/careers/ReferAFriendModal.module.css` | Styling |
| `components/career/Careers.tsx` | Integration |
| `utils/useLetsConnect.tsx` | useReferModal hook |
| `context/ThemeContext.tsx` | State management |

## ✨ Features

- ✅ Form validation with error messages
- ✅ File upload with type/size validation
- ✅ Success notification with auto-close
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Bootstrap integration
- ✅ Global state management
- ✅ Clean, modern UI matching lets-connect

## 🎨 Design

- **Modal Width:** 650px (desktop), responsive (mobile)
- **Submit Button:** Purple gradient (#667eea → #764ba2)
- **Border Color:** Light gray (#dfe6e9)
- **Focus Color:** Purple with shadow
- **Match:** lets-connect modal style

## 🧪 Testing

```typescript
// Test the hook
const { openReferModal, closeReferModal, showReferModal } = useReferModal();

// Open modal
openReferModal(); // showReferModal becomes true

// Close modal
closeReferModal(); // showReferModal becomes false
```

## 🐛 Common Issues

**Modal not showing?**
- Check if `useReferModal()` is being called
- Verify ReferAFriendModal component is rendered with `show` prop
- Check browser console for errors

**Form not submitting?**
- Verify all required fields are filled
- Check that file is uploaded (max 5MB)
- Check network tab for API response
- Look for error message in modal

**Styles not applying?**
- Ensure CSS module is imported
- Check that Bootstrap is installed
- Clear browser cache
- Verify `.module.css` extension

## 📞 Support

For more information, see:
- `REFER_FRIEND_MODAL_README.md` - Full documentation
- `REFER_FRIEND_IMPLEMENTATION.md` - Implementation details
- Component files have inline comments

## 🎯 Next Steps

1. ✅ Modal is ready to use
2. Test API endpoint with sample data
3. Monitor referral submissions
4. Add referral tracking if needed
5. Send confirmation emails to referrer
