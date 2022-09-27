export const isTomigayaEnv = () =>
  import.meta.env.MODE === 'dev' ||
  import.meta.env.MODE === 'stg' ||
  import.meta.env.MODE === 'prd'
