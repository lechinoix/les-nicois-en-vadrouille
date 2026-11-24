import { cloud } from '../lib/photos';
const u = await cloud().api.usage();
console.log(
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      plan: u.plan,
      credits: u.credits,
      storage: u.storage,
      bandwidth: u.bandwidth,
      transformations: u.transformations,
      requests: u.requests,
    },
    null,
    2,
  ),
);
