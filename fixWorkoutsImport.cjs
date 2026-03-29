const fs = require('fs');

const path = 'src/components/WorkoutsPage.tsx';
let text = fs.readFileSync(path, 'utf8');

text = text.replace(
  'import { useAppContext, Workout, isCardioWorkout } from "@/context/AppContext";',
  'import { useAppContext, Workout } from "@/context/AppContext";'
);

text = text.replace(
  "import { useAppContext, Workout, isCardioWorkout } from '@/context/AppContext';",
  "import { useAppContext, Workout } from '@/context/AppContext';"
);

if (!text.includes('const isCardioWorkout =')) {
  const helper = `
const isCardioWorkout = (workout: Workout) => {
  const value = \`\${(workout as any)?.name ?? ""} \${(workout as any)?.title ?? ""} \${(workout as any)?.type ?? ""}\`.toLowerCase();
  return (
    value.includes("cardio") ||
    value.includes("run") ||
    value.includes("running") ||
    value.includes("walk") ||
    value.includes("walking") ||
    value.includes("bike") ||
    value.includes("cycling") ||
    value.includes("swim") ||
    value.includes("rowing") ||
    value.includes("hiit")
  );
};

`;

  const lines = text.split('\n');
  let lastImportIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) lastImportIndex = i;
  }

  if (lastImportIndex >= 0) {
    lines.splice(lastImportIndex + 1, 0, helper.trimEnd());
    text = lines.join('\n');
  } else {
    text = helper + text;
  }
}

fs.writeFileSync(path, text);
console.log('Fixed WorkoutsPage.tsx');
