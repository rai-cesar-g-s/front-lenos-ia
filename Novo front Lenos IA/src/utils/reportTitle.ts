// Limites de UpdatedReport.new_title no contrato OpenAPI.
export const REPORT_TITLE_MIN_LENGTH = 2;
export const REPORT_TITLE_MAX_LENGTH = 100;

export function validateReportTitle(value: string): string {
  const length = Array.from(value.trim()).length;
  return length < REPORT_TITLE_MIN_LENGTH || length > REPORT_TITLE_MAX_LENGTH
    ? 'O título deve conter entre 2 e 100 caracteres.' : '';
}
