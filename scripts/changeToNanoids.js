import adventureData from '../src/lib/data/adventure_data.json' assert { type: 'json' };
import adventureContent from '../src/lib/data/adventure_content.json' assert { type: 'json' };
import { nanoid } from 'nanoid';
import fs from 'fs';
import path from 'path';

let i = 0;
const nanoids = [];

while (i < 100) {
	i++;
	nanoids.push(nanoid(8));
}

const updatedData = JSON.stringify(
	adventureData.map((data) => ({ ...data, id: nanoids[data.id] })),
	null,
	2
);
const updatedContent = JSON.stringify(
	adventureContent.map((data) => ({ ...data, id: nanoids[data.id] })),
	null,
	2
);

fs.writeFileSync(path.resolve('src/lib/data/adventure_data.json'), updatedData);
fs.writeFileSync(path.resolve('src/lib/data/adventure_content.json'), updatedContent);
