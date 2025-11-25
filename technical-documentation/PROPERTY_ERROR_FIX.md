# 🔧 Property Creation Error - Quick Fix

## Problem

Getting `400 Bad Request` when creating properties. Error says "column error" (خطأ في column).

## Root Cause

The **backend terminal** will show the exact error like:
```
Error: Column 'XXX' cannot be null
Error: Field 'YYY' doesn't have a default value
```

## ✅ How to Find the Exact Error

### Step 1: Check Backend Terminal

Look at your **backend terminal** (where you ran `npm run dev`) right after you click submit.

You should see something like:
```
Create property error: Error: Column 'area_id' cannot be null
    at ...
```

**The error message tells you EXACTLY which field is missing!**

### Step 2: Common Missing Fields

Based on the database schema, these fields might be required:
- `unit_for` - Property type (For Sale / For Rent)
- `area_id` - Area selection
- `type_id` - Property type
- `owner_info.offered_by` - Who's offering
- `owner_info.owner_name` - Owner name  
- `more_info.property_name` - Property name

---

## 🎯 Quick Test

Fill in **ONLY these minimum fields** and try again:

1. **Property Name** (in More Info section)
2. **Unit For** (For Sale or For Rent)
3. **Owner Name** (in Owner Info)
4. **Offered By** (in Owner Info)
5. **New Feedback** (in Owner Info)

Leave everything else empty and submit.

---

## 📋 Check Backend Terminal Now

1. Go to your backend terminal
2. Scroll up to see the error after you clicked submit
3. Look for lines starting with:
   - `Create property error:`
   - `Error:`
   - `ER_NO_DEFAULT_FOR_FIELD:`
   - `ER_BAD_NULL_ERROR:`

4. **Copy the FULL error message** and share it with me

Example of what you should see:
```
Create property error: Error: ER_NO_DEFAULT_FOR_FIELD: Field 'area_id' doesn't have a default value
    at Packet.asError (/home/xinreal/vision/backend/node_modules/mysql2/lib/packets/packet.js:728:17)
    at Query.execute (/home/xinreal/vision/backend/node_modules/mysql2/lib/commands/command.js:28:26)
```

---

## 💡 Temporary Workaround

Until we fix the schema, fill in these fields:
- **Unit For**: Select "For Sale" or "For Rent"  
- **Area**: Select any area from dropdown
- **Type**: Select any property type
- **Property Name**: Type anything
- **Owner Name**: Type owner's name
- **Offered By**: Type "Owner" or "Agent"
- **New Feedback**: Type "New" or any text

---

**Share the backend terminal error and I'll fix the exact columns causing the issue!**
