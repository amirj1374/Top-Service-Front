// boolean status
export const Global = {
  TRUE: true,
  FALSE: false
} as const;

export type BooleanStatus = (typeof Global)[keyof typeof Global];

export const BooleanEnumOptions = [
  { title: '✅', value: Global.TRUE },
  { title: '❌', value: Global.FALSE }
];

