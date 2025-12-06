import { NationalCodeValidator } from '@amirjalili1374/ui-kit';

export function nationalCodeRule(nationalCode: string, customerType: 'Real' | 'Legal'): string | false {
  if (!NationalCodeValidator.isValid(nationalCode, customerType)) return 'کد ملی نامعتبر است';
  return false;
}
