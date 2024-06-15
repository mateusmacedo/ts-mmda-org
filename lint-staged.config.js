module.exports = {
  '{libs,apps}/**/*.{js,ts,tsx}': [
    'nx affected --target lint --fix=true --uncommitted=true',
    'nx format:write --uncommitted=true',
    'nx affected --target test --uncommitted=true',
  ],
};
