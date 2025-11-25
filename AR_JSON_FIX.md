# 🚨 URGENT: ar.json File Corrupted

## Problem

The Arabic translation file `src/locales/ar.json` was corrupted during editing.

## Quick Fix

**Please run these commands in your WSL terminal:**

```bash
cd ~/vision

# Backup the broken file
cp src/locales/ar.json src/locales/ar.json.backup

# Restore original from git (if you have git)
git checkout src/locales/ar.json

# OR manually fix the file (see below)
```

---

## Manual Fix (If git doesn't work)

Open `src/locales/ar.json` and make sure it starts like this:

```json
{
    "nav": {
        "dashboard": "لوحة التحكم",
        "properties": "العقارات",
        "leads": "العملاء المحتملين",
        "agents": "الوكلاء",
        "companies": "الشركات",
        "tasks": "المهام",
        "administration": "الإدارة",
        "settings": "الإعدادات",
        "logout": "تسجيل الخروج"
    },
```

**Key changes:**
1. Change `"settings": "الإعدادات"` to → `"administration": "الإدارة"`
2. Add this new section after "nav":

```json
    "administration": {
        "title": "الإدارة",
        "subtitle": "إدارة إعدادات النظام والصلاحيات",
        "tabs": {
            "profiles": "الملفات الشخصية والصلاحيات",
            "dropdowns": " القوائم المنسدلة",
            "users": {
                "label": "المستخدمين",
                "title": "إدارة المستخدمين",
                "comingSoon": "قريباً - سيتم إضافة صفحة إدارة المستخدمين"
            },
            "system": {
                "label": "إعدادات النظام",
                "title": "إعدادات النظام",
                "comingSoon": "قريباً - سيتم إضافة إعدادات النظام"
            },
            "audit": {
                "label": "سجل المراجعة",
                "title": "سجل المراجعة",
                "comingSoon": "قريباً - سيتم إضافة سجل المراجعة"
            }
        }
    },
```

---

## After Fixing

Once the file is restored, I'll:
1. Update the router
2. Update the sidebar
3. Make Administration work with tabs

**Tell me when you're ready!**
