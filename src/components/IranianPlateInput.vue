<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';

// ============================================================================
// Types & Interfaces
// ============================================================================
interface Props {
  modelValue?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

interface PlateParts {
  province: string;
  letter: string;
  digits: string;
  serial: string;
}

// ============================================================================
// Constants
// ============================================================================
const PERSIAN_LETTERS = [
  'الف', 'ب', 'پ', 'ت', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'ژ',
  'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م',
  'ن', 'و', 'ه', 'ی'
] as const;

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'] as const;
const WESTERN_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

const INPUT_SELECTORS = {
  letter: '.letter-input',
  digits: '.digits-input',
  serial: '.serial-input',
} as const;

// ============================================================================
// Props & Emits
// ============================================================================
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: 'پلاک خودرو',
  required: false,
  disabled: false
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

// ============================================================================
// State
// ============================================================================
const plateParts = ref<PlateParts>({
  province: '',
  letter: '',
  digits: '',
  serial: ''
});

const inputRefs = {
  letter: ref<HTMLInputElement | null>(null),
  province: ref<HTMLInputElement | null>(null),
  digits: ref<HTMLInputElement | null>(null),
  serial: ref<HTMLInputElement | null>(null)
};

// ============================================================================
// Computed Properties
// ============================================================================
const fullPlate = computed(() => {
  const { province, letter, digits, serial } = plateParts.value;
  const parts = [province, letter, digits, serial].filter(Boolean);
  return parts.join(' ');
});

// ============================================================================
// Utility Functions
// ============================================================================
/**
 * Converts Western digits (0-9) to Persian digits (۰-۹)
 */
function toPersianDigits(str: string): string {
  if (!str) return '';
  return str.replace(/\d/g, (digit) => PERSIAN_DIGITS[parseInt(digit)]);
}

/**
 * Converts Persian digits (۰-۹) to Western digits (0-9)
 */
function toWesternDigits(str: string): string {
  if (!str) return '';
  return str
    .split('')
    .map((char) => {
      const index = PERSIAN_DIGITS.indexOf(char as typeof PERSIAN_DIGITS[number]);
      return index !== -1 ? WESTERN_DIGITS[index] : char;
    })
    .join('');
}

/**
 * Extracts only digits from a string and converts to Western format
 */
function extractDigits(str: string): string {
  return toWesternDigits(str).replace(/\D/g, '');
}

/**
 * Focuses the next input field in sequence
 */
function focusNextField(selector: string, delay = 10): void {
  setTimeout(() => {
    const nextInput = document.querySelector(selector) as HTMLInputElement;
    nextInput?.focus();
  }, delay);
}

/**
 * Updates input display value with Persian digits
 */
function updateInputDisplay(
  input: HTMLInputElement | null,
  value: string,
  convertToPersian = true
): void {
  if (!input) return;
  const displayValue = convertToPersian ? toPersianDigits(value) : value;
  if (input.value !== displayValue) {
    input.value = displayValue;
  }
}

// ============================================================================
// Input Handlers
// ============================================================================
/**
 * Generic handler for numeric inputs (province, digits, serial)
 */
function createNumericHandler(
  field: keyof Pick<PlateParts, 'province' | 'digits' | 'serial'>,
  maxLength: number,
  nextFieldSelector?: string,
  nextFieldName?: keyof PlateParts
) {
  return (event: Event) => {
    const input = event.target as HTMLInputElement;
    let value = extractDigits(input.value);
    
    if (value.length > maxLength) {
      value = value.substring(0, maxLength);
    }
    
    plateParts.value[field] = value;
    updateInputDisplay(input, value);
    
    // Auto-focus next field if max length reached
    if (value.length === maxLength && nextFieldSelector && nextFieldName) {
      const nextFieldValue = plateParts.value[nextFieldName];
      if (!nextFieldValue) {
        focusNextField(nextFieldSelector);
      }
    }
  };
}

/**
 * Handles province input (2 digits)
 */
const handleProvinceInput = createNumericHandler('province', 2, INPUT_SELECTORS.letter, 'letter');

/**
 * Handles digits input (3 digits)
 */
function handleDigitsInput(event: Event) {
  const handler = createNumericHandler('digits', 3, INPUT_SELECTORS.serial, 'serial');
  handler(event);
  // Ensure Persian digits are displayed
  nextTick(() => {
    const input = event.target as HTMLInputElement;
    const value = plateParts.value.digits;
    if (input && value) {
      input.value = toPersianDigits(value);
    }
  });
}

/**
 * Handles serial input (2 digits)
 */
function handleSerialInput(event: Event) {
  const handler = createNumericHandler('serial', 2);
  handler(event);
  // Ensure Persian digits are displayed
  nextTick(() => {
    const input = event.target as HTMLInputElement;
    const value = plateParts.value.serial;
    if (input && value) {
      input.value = toPersianDigits(value);
    }
  });
}

/**
 * Handles letter input
 */
function handleLetterInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  const value = input.value.trim();
  
  plateParts.value.letter = value;
  updateInputDisplay(inputRefs.letter.value, value, false);
  
  // Auto-focus next field if valid letter
  if (PERSIAN_LETTERS.includes(value as typeof PERSIAN_LETTERS[number]) && !plateParts.value.digits) {
    focusNextField(INPUT_SELECTORS.digits);
  }
}

/**
 * Handles letter change (datalist selection)
 */
function handleLetterChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  const value = input.value.trim();
  
  if (value && PERSIAN_LETTERS.includes(value as typeof PERSIAN_LETTERS[number])) {
    plateParts.value.letter = value;
    nextTick(() => updateInputDisplay(inputRefs.letter.value, value, false));
    
    if (!plateParts.value.digits) {
      focusNextField(INPUT_SELECTORS.digits);
    }
  } else if (value) {
    // Try to find matching letter
    const found = PERSIAN_LETTERS.find(l => value.includes(l));
    if (found) {
      plateParts.value.letter = found;
      input.value = found;
      updateInputDisplay(inputRefs.letter.value, found, false);
    }
  }
}

/**
 * Validates and cleans letter on blur
 */
function handleLetterBlur(event: Event): void {
  const input = event.target as HTMLInputElement;
  const value = input.value.trim();
  
  if (value && !PERSIAN_LETTERS.includes(value as typeof PERSIAN_LETTERS[number])) {
    plateParts.value.letter = '';
    input.value = '';
  } else if (value) {
    plateParts.value.letter = value;
    input.value = value;
  }
}

// ============================================================================
// Parsing & Initialization
// ============================================================================
/**
 * Parses a plate number string into its components
 */
function parsePlateNumber(plate: string): void {
  const cleaned = plate.replace(/\s+/g, ' ').trim();
  const parts = cleaned.split(' ');

  if (parts.length >= 4) {
    plateParts.value = {
      province: extractDigits(parts[0]),
      letter: parts[1] || '',
      digits: extractDigits(parts[2]),
      serial: extractDigits(parts[3])
    };
  } else if (cleaned.length >= 8) {
    // Parse without spaces - find Persian letter
    const letterMatch = cleaned.match(/[\u0600-\u06FF]/);
    if (letterMatch?.index !== undefined) {
      const beforeLetter = extractDigits(cleaned.substring(0, letterMatch.index));
      const afterLetter = extractDigits(cleaned.substring(letterMatch.index + 1));
      
      plateParts.value = {
        province: beforeLetter.substring(0, 2),
        letter: letterMatch[0],
        digits: afterLetter.substring(0, 3),
        serial: afterLetter.substring(3, 5)
      };
    }
  }
}

/**
 * Updates all display inputs with Persian digits
 */
function updateAllDisplayInputs(): void {
  nextTick(() => {
    const { province, digits, serial } = plateParts.value;
    
    updateInputDisplay(inputRefs.province.value, province);
    
    const digitsInput = document.querySelector(INPUT_SELECTORS.digits) as HTMLInputElement;
    const serialInput = document.querySelector(INPUT_SELECTORS.serial) as HTMLInputElement;
    
    updateInputDisplay(digitsInput, digits);
    updateInputDisplay(serialInput, serial);
  });
}

// ============================================================================
// Validation Rules
// ============================================================================
const provinceRules = [
  (v: string) => !!v || 'کد استان الزامی است',
  (v: string) => /^\d{2}$/.test(v) || 'کد استان باید 2 رقم باشد',
  (v: string) => {
    const num = parseInt(v);
    return (num >= 11 && num <= 99) || 'کد استان باید بین 11 تا 99 باشد';
  }
];

const letterRules = [
  (v: string) => !!v || 'حرف الزامی است',
  (v: string) => PERSIAN_LETTERS.includes(v as typeof PERSIAN_LETTERS[number]) || 'حرف معتبر نیست'
];

const digitsRules = [
  (v: string) => !!v || 'عدد الزامی است',
  (v: string) => /^\d{3}$/.test(v) || 'باید 3 رقم باشد'
];

const serialRules = [
  (v: string) => !!v || 'سریال الزامی است',
  (v: string) => /^\d{2}$/.test(v) || 'سریال باید 2 رقم باشد'
];

// ============================================================================
// Watchers
// ============================================================================
// Emit full plate value when it changes
watch(fullPlate, (newValue) => {
  emit('update:modelValue', newValue);
});

// Sync letter input display
watch(() => plateParts.value.letter, (newValue) => {
  nextTick(() => {
    updateInputDisplay(inputRefs.letter.value, newValue || '', false);
  });
}, { immediate: true });

// Sync province input display with Persian digits
watch(() => plateParts.value.province, (newValue) => {
  nextTick(() => {
    updateInputDisplay(inputRefs.province.value, newValue);
  });
}, { immediate: true });

// Sync digits input display with Persian digits
watch(() => plateParts.value.digits, (newValue) => {
  nextTick(() => {
    updateInputDisplay(inputRefs.digits.value, newValue);
  });
}, { immediate: true });

// Sync serial input display with Persian digits
watch(() => plateParts.value.serial, (newValue) => {
  nextTick(() => {
    updateInputDisplay(inputRefs.serial.value, newValue);
  });
}, { immediate: true });

// Watch external modelValue changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && newValue !== fullPlate.value) {
      parsePlateNumber(newValue);
      updateAllDisplayInputs();
    }
  },
  { immediate: true }
);

// ============================================================================
// Expose API
// ============================================================================
defineExpose({
  validate: (): boolean => {
    const { province, letter, digits, serial } = plateParts.value;
    return !!(province && letter && digits && serial);
  },
  getValue: (): string => fullPlate.value
});
</script>

<template>
  <div class="iranian-plate-input">
    <label v-if="label" class="plate-label mb-4 d-block">
      {{ label }}<span v-if="required" class="text-error"> *</span>
    </label>

    <!-- Visual Plate Display -->
    <div class="plate-display-container">
      <div class="iranian-plate">
        <!-- Left Blue Strip -->
        <div class="plate-blue-strip">
          <div class="flag-container">
            <div class="iran-flag">
              <div class="flag-stripe green"></div>
              <div class="flag-stripe white"></div>
              <div class="flag-stripe red"></div>
            </div>
          </div>
          <div class="ir-text">
            <div class="ir-line">I.R.</div>
            <div class="ir-line">IRAN</div>
          </div>
        </div>

        <!-- Main White Section -->
        <div class="plate-main-section">
          <div class="plate-content">
            <!-- Three Digits -->
            <input
              ref="inputRefs.digits"
              :value="plateParts.digits ? toPersianDigits(plateParts.digits) : ''"
              :disabled="disabled"
              type="text"
              inputmode="numeric"
              maxlength="3"
              class="plate-input digits-input"
              placeholder="۵۵۶"
              @input="handleDigitsInput"
            />

            <!-- Persian Letter -->
            <input
              ref="inputRefs.letter"
              v-model="plateParts.letter"
              :disabled="disabled"
              type="text"
              class="plate-input letter-input"
              placeholder="م"
              list="persian-letters"
              @input="handleLetterInput"
              @change="handleLetterChange"
              @blur="handleLetterBlur"
            />
            <datalist id="persian-letters">
              <option v-for="letter in PERSIAN_LETTERS" :key="letter" :value="letter" />
            </datalist>

            <!-- Serial (2 digits) -->
            <input
              ref="inputRefs.serial"
              :value="plateParts.serial ? toPersianDigits(plateParts.serial) : ''"
              :disabled="disabled"
              type="text"
              inputmode="numeric"
              maxlength="2"
              class="plate-input serial-input"
              placeholder="۱۳"
              @input="handleSerialInput"
            />
          </div>

          <!-- Right Section with Iran text -->
          <div class="plate-right-section">
            <div class="iran-text">ایران</div>
            <!-- Province Code (2 digits) -->
            <input
              ref="inputRefs.province"
              :value="plateParts.province ? toPersianDigits(plateParts.province) : ''"
              :disabled="disabled"
              type="text"
              inputmode="numeric"
              maxlength="2"
              class="plate-input province-input province-display"
              placeholder="۱۳"
              @input="handleProvinceInput"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Hidden validation fields -->
    <div class="d-none">
      <v-text-field
        v-model="plateParts.province"
        :rules="required ? provinceRules : []"
        hide-details
      />
      <v-text-field
        v-model="plateParts.letter"
        :rules="required ? letterRules : []"
        hide-details
      />
      <v-text-field
        v-model="plateParts.digits"
        :rules="required ? digitsRules : []"
        hide-details
      />
      <v-text-field
        v-model="plateParts.serial"
        :rules="required ? serialRules : []"
        hide-details
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.iranian-plate-input {
  .plate-label {
    font-weight: 500;
    font-size: 13px;
    margin-bottom: 10px;
  }

  .plate-display-container {
    display: flex;
    justify-content: center;
    margin: 12px 0;
  }

  .iranian-plate {
    display: flex;
    width: 100%;
    max-width: 350px;
    height: 75px;
    background: #ffffff;
    border: 2.5px solid #000000;
    border-radius: 2px;
    box-shadow:
      0 2px 6px rgba(0, 0, 0, 0.12),
      inset 0 0 0 1px rgba(255, 255, 255, 0.1);
    overflow: hidden;
    position: relative;
    direction: ltr;
    margin: 0 auto;
  }

  // Left Blue Strip
  .plate-blue-strip {
    width: 45px;
    background: linear-gradient(180deg, #003d82 0%, #002d5f 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 5px 3px 4px;
    position: relative;
    flex-shrink: 0;

    .flag-container {
      margin-top: 4px;
    }

    .iran-flag {
      width: 25px;
      height: 14px;
      border: 0.5px solid rgba(0, 0, 0, 0.25);
      border-radius: 1px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      margin-top: 3px;

      .flag-stripe {
        height: 33.33%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .green {
        background: #1d8f3a;
      }

      .white {
        background: #ffffff;
        position: relative;

        .flag-emblem {
          font-size: 7px;
          color: #c8102e;
          font-weight: 900;
          font-family: var(--font-theme), sans-serif;
          line-height: 0.85;
          transform: scale(0.9);
        }
      }

      .red {
        background: #c8102e;
      }
    }

    .ir-text {
      color: #ffffff;
      font-weight: 550;
      text-align: center;
      line-height: 1.1;
      margin-bottom: 1px;
      font-family: var(--font-theme), sans-serif;
      letter-spacing: 0.3px;
      text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);

      .ir-line {
        margin: 1px 0;
        font-size: 2px;
      }
    }
  }

  // Main White Section
  .plate-main-section {
    flex: 1;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-left: 1px solid #000000;

    .plate-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-family: var(--font-theme), sans-serif;
      width: 100%;
      direction: rtl;
    }

    .plate-input {
      border: none;
      background: transparent;
      text-align: center;
      font-size: 28px;
      font-weight: 900;
      color: #000000;
      outline: none;
      width: auto;
      min-width: 0;
      font-family: var(--font-theme), sans-serif;
      direction: rtl;
      padding: 0;
      line-height: 1.1;
      letter-spacing: 0.5px;
      text-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);

      &::placeholder {
        color: #e5e7eb;
        opacity: 0.5;
      }

      &:focus {
        background: rgba(0, 0, 0, 0.015);
        border-radius: 2px;
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }

    .letter-input {
      width: 70px;
      font-size: 28px;
      color: #000000 !important;
      min-width: 35px;
      opacity: 1 !important;
      visibility: visible !important;
      
      &, &:focus, &:active, &:hover {
        color: #000000 !important;
        opacity: 1 !important;
      }
      
      &::-webkit-input-placeholder,
      &::-ms-input-placeholder,
      &::placeholder {
        color: #e5e7eb;
        opacity: 0.5;
      }
      
      &[value] {
        color: #000000 !important;
      }
    }

    .digits-input {
      width: 62px;
      font-size: 28px;
    }

    .serial-input {
      width: 42px;
      font-size: 28px;
    }
  }

  // Right Section with Iran text
  .plate-right-section {
    width: 50px;
    background: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5px 3px;
    border-left: 1px solid #000000;
    flex-shrink: 0;

    .iran-text {
      font-size: 5px;
      font-weight: 700;
      color: #000000;
      margin-bottom: 8px;
      font-family: var(--font-theme), sans-serif;
    }

    .province-display {
      font-size: 15px;
      font-weight: 900;
      color: #000000 !important;
      font-family: var(--font-theme), sans-serif;
      direction: rtl;
      border: none;
      background: transparent;
      text-align: center;
      outline: none;
      width: 100%;
      padding: 0;
      line-height: 1.1;
      opacity: 1 !important;
      visibility: visible !important;
      
      &::placeholder {
        color: #e5e7eb;
        opacity: 0.5;
      }
      
      &:focus {
        background: rgba(0, 0, 0, 0.015);
        border-radius: 2px;
      }
      
      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }
  }

  // Responsive
  @media (max-width: 600px) {
    .iranian-plate {
      max-width: 100%;
      height: 65px;
    }

    .plate-main-section {
      padding: 0 8px;

      .plate-input {
        font-size: 22px;
        letter-spacing: 0.3px;
      }

      .letter-input {
        width: 28px;
        font-size: 20px;
      }

      .digits-input {
        width: 50px;
        font-size: 22px;
      }

      .serial-input {
        width: 35px;
        font-size: 22px;
      }
    }

    .plate-blue-strip {
      width: 30px;
      padding: 4px 2px;

      .iran-flag {
        width: 18px;
        height: 12px;
      }

      .ir-text {
        font-size: 5px;
      }
    }

    .plate-right-section {
      width: 35px;
      padding: 4px 2px;

      .iran-text {
        font-size: 9px;
      }

      .province-display {
        font-size: 11px;
      }
    }
  }
}
</style>