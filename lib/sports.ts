import catalog from './sports.json';

// Both climbing disciplines use the existing climbing cover. Keep one complete
// catalog for navigation, filters, article labels, and editor choices.
const sports = catalog.flatMap((sport) =>
  sport.slug === 'ESCALADE_GRANDE_VOIE'
    ? [
        { ...sport, name: 'Escalade en grande voie' },
        { ...sport, slug: 'ESCALADE_COUENNE', name: 'Escalade en couenne' },
      ]
    : [sport],
);

export default sports;
