const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

content = content.replace(
  'const appleConverted = converted.map((e) => ({ ...e, id: "apple-" + e.id }));',
  'const appleConverted = converted.map((e) => ({ ...e, id: "apple-" + e.id }));\n      console.log("Apple events:", appleConverted.slice(0,2).map(e => e.id));'
);

fs.writeFileSync('src/context/AppContext.tsx', content);
console.log('Done!');
