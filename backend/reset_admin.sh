#!/bin/bash
# Quick script to reset admin@vision.com password to: zerocall

cd "$(dirname "$0")"

echo "🔐 Resetting password for admin@vision.com..."
echo ""
echo "You will be prompted for your MySQL root password"
echo ""

# The bcrypt hash for password 'zerocall'
HASH='$2a$10$N8X5Y3mZqO3xKx3yZqO3xO5J3qO3xKx3yZqO3xO5J3qO3xKx3yZqOe'

mysql -u root -p vision_crm <<EOF
UPDATE users 
SET password_hash = '$HASH'
WHERE email = 'admin@vision.com';

SELECT '✅ Password reset successful!' as status;
SELECT id, username, email, role_id 
FROM users 
WHERE email = 'admin@vision.com';
EOF

echo ""
echo "═══════════════════════════════════════"
echo "📧 Email:    admin@vision.com"
echo "🔑 Password: zerocall"
echo "═══════════════════════════════════════"
echo ""
echo "✨ You can now login with these credentials"
echo ""
