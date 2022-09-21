// NOTE: React Hook Formでは未入力状態の場合、空文字（''）が設定されるため、registerで `setValueAs` にこの関数を指定して未入力の場合は `undefined` が設定されるように
// https://react-hook-form.com/api/useform/register/
// https://github.com/react-hook-form/react-hook-form/issues/656
export const setUndefinedOrString = (v: string) => (!v ? undefined : v)
