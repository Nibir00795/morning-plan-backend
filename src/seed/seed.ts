import { DataSource } from 'typeorm';
import { TaskIcon } from '../entities/task-icon.entity';
import { FamousPerson } from '../entities/famous-person.entity';
import { FamousTask } from '../entities/famous-task.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER || 'morning_plan',
  password: process.env.POSTGRES_PASSWORD || 'morning_plan_secret',
  database: process.env.POSTGRES_DB || 'morning_plan',
  entities: [TaskIcon, FamousPerson, FamousTask],
  synchronize: false,
});

const ICONS = [
  { name: 'droplet', assetKey: 'droplet' },
  { name: 'tooth', assetKey: 'dental-tooth' },
  { name: 'stretch', assetKey: 'workout-warm-up' },
  { name: 'sun', assetKey: 'sun-01' },
  { name: 'book', assetKey: 'book-open' },
  { name: 'coffee', assetKey: 'coffee' },
  { name: 'run', assetKey: 'running' },
  { name: 'meditate', assetKey: 'meditation' },
  { name: 'egg', assetKey: 'egg' },
  { name: 'shower', assetKey: 'shower' },
  { name: 'journal', assetKey: 'journal' },
  { name: 'phone-off', assetKey: 'phone-off' },
  { name: 'prayer', assetKey: 'prayer' },
  { name: 'walk', assetKey: 'walk' },
  { name: 'music', assetKey: 'music' },
  { name: 'skincare', assetKey: 'skincare' },
  { name: 'alarm', assetKey: 'alarm-clock' },
  { name: 'bed', assetKey: 'bed' },
  { name: 'apple', assetKey: 'apple' },
  { name: 'gym', assetKey: 'dumbbell' },
];

interface PersonSeed {
  name: string;
  isFeatured: boolean;
  tasks: { name: string; iconName: string }[];
}

const FAMOUS_PERSONS: PersonSeed[] = [
  {
    name: 'Mark Zuckerberg',
    isFeatured: true,
    tasks: [
      { name: 'Wake up at 6:00 AM', iconName: 'alarm' },
      { name: 'Morning workout', iconName: 'gym' },
      { name: 'Cold shower', iconName: 'shower' },
      { name: 'Breakfast with family', iconName: 'egg' },
      { name: 'Review daily goals', iconName: 'journal' },
      { name: 'Check messages', iconName: 'phone-off' },
      { name: 'Team standup', iconName: 'coffee' },
      { name: 'Deep work block', iconName: 'book' },
      { name: 'Walk meeting', iconName: 'walk' },
      { name: 'Read for 30 minutes', iconName: 'book' },
      { name: 'Stretch', iconName: 'stretch' },
      { name: 'Drink water', iconName: 'droplet' },
      { name: 'Meditate 10 minutes', iconName: 'meditate' },
      { name: 'Plan tomorrow', iconName: 'journal' },
      { name: 'Brush teeth', iconName: 'tooth' },
    ],
  },
  {
    name: 'Dr William Li',
    isFeatured: false,
    tasks: [
      { name: 'Wake up at 5:30 AM', iconName: 'alarm' },
      { name: 'Drink warm lemon water', iconName: 'droplet' },
      { name: 'Morning meditation', iconName: 'meditate' },
      { name: 'Healthy breakfast', iconName: 'apple' },
      { name: 'Walk 30 minutes', iconName: 'walk' },
      { name: 'Read health research', iconName: 'book' },
      { name: 'Stretch routine', iconName: 'stretch' },
      { name: 'Take supplements', iconName: 'egg' },
      { name: 'Journaling', iconName: 'journal' },
      { name: 'Brush teeth', iconName: 'tooth' },
      { name: 'Cold exposure', iconName: 'shower' },
      { name: 'Review patient notes', iconName: 'book' },
      { name: 'Green tea', iconName: 'coffee' },
      { name: 'Gratitude practice', iconName: 'prayer' },
    ],
  },
  {
    name: 'Ashton Hall',
    isFeatured: true,
    tasks: [
      { name: 'Wake up at 5:00 AM', iconName: 'alarm' },
      { name: 'Drink a glass of water', iconName: 'droplet' },
      { name: 'Workout 45 minutes', iconName: 'gym' },
      { name: 'Cold shower', iconName: 'shower' },
      { name: 'High protein breakfast', iconName: 'egg' },
      { name: 'Brush teeth', iconName: 'tooth' },
      { name: 'Meditate 20 minutes', iconName: 'meditate' },
      { name: 'Journal goals', iconName: 'journal' },
      { name: 'Read 20 pages', iconName: 'book' },
      { name: 'Stretch', iconName: 'stretch' },
      { name: 'Walk outside', iconName: 'walk' },
      { name: 'No phone first hour', iconName: 'phone-off' },
      { name: 'Listen to podcast', iconName: 'music' },
      { name: 'Plan the day', iconName: 'journal' },
      { name: 'Morning affirmations', iconName: 'prayer' },
    ],
  },
  {
    name: 'Hailey Bieber',
    isFeatured: false,
    tasks: [
      { name: 'Wake up at 7:00 AM', iconName: 'alarm' },
      { name: 'Drink water with lemon', iconName: 'droplet' },
      { name: 'Skincare routine', iconName: 'skincare' },
      { name: 'Pilates workout', iconName: 'stretch' },
      { name: 'Green smoothie', iconName: 'apple' },
      { name: 'Brush teeth', iconName: 'tooth' },
      { name: 'Gratitude journal', iconName: 'journal' },
      { name: 'Shower', iconName: 'shower' },
      { name: 'Coffee', iconName: 'coffee' },
      { name: 'Meditate 10 minutes', iconName: 'meditate' },
      { name: 'Walk the dog', iconName: 'walk' },
      { name: 'Read', iconName: 'book' },
      { name: 'Morning prayer', iconName: 'prayer' },
      { name: 'Moisturize', iconName: 'skincare' },
      { name: 'Listen to music', iconName: 'music' },
      { name: 'Plan outfit', iconName: 'journal' },
      { name: 'Stretch', iconName: 'stretch' },
      { name: 'Check schedule', iconName: 'journal' },
      { name: 'Breakfast', iconName: 'egg' },
      { name: 'Sunscreen', iconName: 'skincare' },
    ],
  },
  {
    name: 'Elon Musk',
    isFeatured: true,
    tasks: [
      { name: 'Wake up at 7:00 AM', iconName: 'alarm' },
      { name: 'Skip breakfast / coffee only', iconName: 'coffee' },
      { name: 'Shower', iconName: 'shower' },
      { name: 'Review critical emails', iconName: 'phone-off' },
      { name: 'Self reflection', iconName: 'meditate' },
      { name: 'Goal setting', iconName: 'journal' },
      { name: 'Read news & research', iconName: 'book' },
      { name: 'Exercise 30 minutes', iconName: 'gym' },
      { name: 'Brush teeth', iconName: 'tooth' },
      { name: 'Walk to think', iconName: 'walk' },
      { name: 'Drink water', iconName: 'droplet' },
      { name: 'Stretch', iconName: 'stretch' },
      { name: 'Plan the day', iconName: 'journal' },
      { name: 'Deep work block', iconName: 'book' },
      { name: 'Team sync call', iconName: 'coffee' },
    ],
  },
];

async function seed() {
  await dataSource.initialize();
  console.log('Connected to database');

  const iconRepo = dataSource.getRepository(TaskIcon);
  const fpRepo = dataSource.getRepository(FamousPerson);
  const ftRepo = dataSource.getRepository(FamousTask);

  // Seed icons
  const iconMap = new Map<string, TaskIcon>();
  for (const iconData of ICONS) {
    let icon = await iconRepo.findOne({ where: { name: iconData.name } });
    if (!icon) {
      icon = iconRepo.create(iconData);
      icon = await iconRepo.save(icon);
    }
    iconMap.set(icon.name, icon);
  }
  console.log(`Seeded ${iconMap.size} icons`);

  // Seed famous persons + tasks
  for (const personData of FAMOUS_PERSONS) {
    let person = await fpRepo.findOne({ where: { name: personData.name } });
    if (!person) {
      person = fpRepo.create({
        name: personData.name,
        isFeatured: personData.isFeatured,
        taskCount: personData.tasks.length,
      });
      person = await fpRepo.save(person);
    }

    const existingTasks = await ftRepo.count({ where: { famousPersonId: person.id } });
    if (existingTasks === 0) {
      const tasks = personData.tasks.map((t, i) =>
        ftRepo.create({
          famousPersonId: person!.id,
          name: t.name,
          iconId: iconMap.get(t.iconName)?.id,
          sortOrder: i,
        }),
      );
      await ftRepo.save(tasks);
    }

    console.log(`Seeded ${personData.name} with ${personData.tasks.length} tasks`);
  }

  console.log('Seed complete!');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
