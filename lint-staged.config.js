module.exports = {
  '{libs,apps}/**/*.{js,ts,tsx}': [
    'nx affected --target test',
    'nx affected --target lint --fix=true',
    'nx format:write',
  ],
};
