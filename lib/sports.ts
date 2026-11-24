import catalog from './sports.json';

// Historical presentation defaults for seeded sport codes; editable labels and
// available choices now come from the database.
const sports = catalog.flatMap((sport) =>
  sport.slug === 'ESCALADE_GRANDE_VOIE'
    ? [
        { ...sport, name: 'Escalade en grande voie' },
        { ...sport, slug: 'ESCALADE_COUENNE', name: 'Escalade en couenne' },
      ]
    : [sport],
);

export default sports;

export type SportChoice = { slug: string; name: string; archived: boolean };
