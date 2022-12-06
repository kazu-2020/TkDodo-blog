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

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest
  describe('formatDatetime', () => {
    it('正しくフォーマットされること', () => {
      expect(formatDatetime('2022-01-02 23:04:05')).toEqual(
        '2022年1月2日 23:04'
      )
    })
  })

  describe('formatDatetimeShort', () => {
    it('正しくフォーマットされること', () => {
      expect(formatDatetimeShort('2022-01-02 23:04:05')).toEqual('1月2日 23:04')
    })
  })

  describe('formatTime', () => {
    it('正しくフォーマットされること', () => {
      expect(formatTime('2022-01-02 23:04:05')).toEqual('23:4')
    })
  })

  describe('formatDate', () => {
    it('正しくフォーマットされること', () => {
      expect(formatDate('2022-01-02 23:04:05')).toEqual('2022年01月02日')
    })
  })

  describe('formatDateWithWeekday', () => {
    it('正しくフォーマットされること', () => {
      expect(formatDateWithWeekday('2022-01-02 23:04:05')).toEqual(
        '2022年01月02日(日)'
      )
    })
  })

  describe('formatDateShortWithWeekday', () => {
    it('正しくフォーマットされること', () => {
      expect(formatDateShortWithWeekday('2022-01-02 23:04:05')).toEqual(
        '1月2日(日)'
      )
    })
  })

  describe('formatDatetimeWithWeekday', () => {
    it('正しくフォーマットされること', () => {
      expect(formatDatetimeWithWeekday('2022-01-02 23:04:05')).toEqual(
        '2022年01月02日(日) 23:04'
      )
    })
  })
}
