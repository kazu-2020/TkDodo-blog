// eslint-disable-next-line import/no-duplicates
import ja from 'date-fns/locale/ja'
// eslint-disable-next-line import/no-duplicates
import format from 'date-fns/format'

export const formatDatetime = (datetime: string): string =>
  format(new Date(datetime), 'yyyy年M月d日 HH:mm', {
    locale: ja
  })

export const formatDatetimeShort = (datetime: string): string =>
  format(new Date(datetime), 'M月d日 HH:mm', {
    locale: ja
  })

export const formatTime = (datetime: string): string =>
  format(new Date(datetime), 'H:m', {
    locale: ja
  })

export const formatDate = (datetime: string): string =>
  format(new Date(datetime), 'yyyy年MM月dd日', {
    locale: ja
  })

export const formatDateWithWeekday = (datetime: string): string =>
  format(new Date(datetime), 'yyyy年MM月dd日(E)', {
    locale: ja
  })

export const formatDateShortWithWeekday = (datetime: string): string =>
  format(new Date(datetime), 'M月d日(E)', {
    locale: ja
  })

export const formatDatetimeWithWeekday = (datetime: string): string =>
  format(new Date(datetime), 'yyyy年MM月dd日(E) HH:mm', {
    locale: ja
  })
