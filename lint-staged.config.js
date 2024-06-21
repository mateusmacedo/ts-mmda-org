module.exports = {
  '{libs,apps}/**/*.{js,ts,tsx}': [
    'nx format:write --uncommitted=true',
    'nx affected --target lint --fix=true --uncommitted=true --parallel=5',
    'nx affected --target test --uncommitted=true --parallel=5',
  ],
};
