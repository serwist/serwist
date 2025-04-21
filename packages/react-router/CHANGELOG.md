# @serwist/react-router

## 10.0.0-preview.8
### Patch Changes

- Updated dependencies [[`6cec717`](https://github.com/serwist/serwist/commit/6cec7175feb06ea2594b571914466bb1c38bf5d3)]:
  - vite-plugin-serwist@10.0.0-preview.8
  - @serwist/build@10.0.0-preview.8
  - @serwist/utils@10.0.0-preview.8
  - @serwist/window@10.0.0-preview.8

## 10.0.0-preview.7
### Patch Changes



- [`580db86`](https://github.com/serwist/serwist/commit/580db86b7f5616ba05a89970e8ce83791f920340) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(all): mark all packages as side-effects-free
  
  - All packages don't have side-effects, so `"sideEffects": false` has been added to them to aid bundlers in tree-shaking them.
- Updated dependencies [[`f77e1b2`](https://github.com/serwist/serwist/commit/f77e1b2bdc53f8b46b2e231e0151b237da3446ec), [`580db86`](https://github.com/serwist/serwist/commit/580db86b7f5616ba05a89970e8ce83791f920340), [`f77e1b2`](https://github.com/serwist/serwist/commit/f77e1b2bdc53f8b46b2e231e0151b237da3446ec)]:
  - vite-plugin-serwist@10.0.0-preview.7
  - @serwist/window@10.0.0-preview.7
  - @serwist/build@10.0.0-preview.7
  - @serwist/utils@10.0.0-preview.7

## 10.0.0-preview.6
### Patch Changes

- Updated dependencies [[`ae998db`](https://github.com/serwist/serwist/commit/ae998dbbd9287a536e332310cb37073f7717de3a)]:
  - @serwist/window@10.0.0-preview.6
  - vite-plugin-serwist@10.0.0-preview.6
  - @serwist/build@10.0.0-preview.6
  - @serwist/utils@10.0.0-preview.6

## 10.0.0-preview.5
### Patch Changes



- [`c0022af`](https://github.com/serwist/serwist/commit/c0022afad69df14fb6b89be3636afef1cafd4b70) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(react-router/preview): removed faulty React components
  
  - Turns out we can't just import virtual modules in our own modules as they get externalized for React Router's SSR build... It worked on my machine though, as React Router seems to bundle local packages as well.
- Updated dependencies []:
  - @serwist/build@10.0.0-preview.5
  - @serwist/utils@10.0.0-preview.5
  - @serwist/window@10.0.0-preview.5
  - vite-plugin-serwist@10.0.0-preview.5

## 10.0.0-preview.4
### Minor Changes



- [`0c3d0b4`](https://github.com/serwist/serwist/commit/0c3d0b4b474d581873e65b497c07542a311bbab4) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor(react-router/preview): rewrite `@serwist/react-router`
  
  - In this preview patch, `@serwist/react-router` has been rewritten. It is now a Vite plugin rather than a React Router preset.
  
  - This also allows us to support development mode.

### Patch Changes

- Updated dependencies []:
  - @serwist/build@10.0.0-preview.4
  - @serwist/utils@10.0.0-preview.4
  - @serwist/window@10.0.0-preview.4
  - vite-plugin-serwist@10.0.0-preview.4

## 10.0.0-preview.3
### Patch Changes

- Updated dependencies [[`dd0f7d6`](https://github.com/serwist/serwist/commit/dd0f7d642940baadecafa210f7c2cdd68407bc1c)]:
  - @serwist/utils@10.0.0-preview.3
  - @serwist/build@10.0.0-preview.3

## 10.0.0-preview.2
### Minor Changes



- [`af82ab6`](https://github.com/serwist/serwist/commit/af82ab622e0ff6b4669fd49e9489e7497d232b29) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - feat(react-router): added `@serwist/react-router`
  
  - This module helps developers integrate Serwist into their React Router applications.

### Patch Changes

- Updated dependencies [[`af82ab6`](https://github.com/serwist/serwist/commit/af82ab622e0ff6b4669fd49e9489e7497d232b29)]:
  - @serwist/build@10.0.0-preview.2
  - @serwist/utils@10.0.0-preview.2
