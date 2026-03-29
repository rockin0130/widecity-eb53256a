const fs = require('fs');

const file = 'src/components/CalendarPage.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import AppleBadge from "@/components/AppleBadge";')) {
  content = content.replace(
    'import { supabase } from "@/integrations/supabase/client";\n',
    'import { supabase } from "@/integrations/supabase/client";\nimport AppleBadge from "@/components/AppleBadge";\nimport GoogleBadge from "@/components/GoogleBadge";\n'
  );
}

fs.writeFileSync(file, content);
console.log('Badge imports added');
