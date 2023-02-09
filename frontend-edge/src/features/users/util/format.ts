import { SystemRole } from '@/types/user'

export const changeSystemRoleToDisplayName = (role: SystemRole) => {
  switch (role) {
    case 'userAdmin':
      return 'ユーザー管理者'
    case 'playlistAdmin':
      return 'プレイリスト管理者'
    case 'deckAdmin':
      return 'デッキ管理者'
    case 'readerUser':
      return '閲覧者'
    default: {
      const invalidRole: never = role
      throw new Error(`${invalidRole}は不正な値です`)
    }
  }
}

export const changeSystemRolesToDisplayName = (roles: SystemRole[]) =>
  roles.map(changeSystemRoleToDisplayName).join(',')

export const fullName = (firstName = '', lastName = '') => {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`
  }

  return firstName + lastName
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('changeSystemRoleToDisplayName', () => {
    it('userAdminの場合、「ユーザー管理者」を返すこと', () => {
      expect(changeSystemRoleToDisplayName('userAdmin')).toBe('ユーザー管理者')
    })

    it('playlistAdminの場合、「プレイリスト管理者」を返すこと', () => {
      expect(changeSystemRoleToDisplayName('playlistAdmin')).toBe(
        'プレイリスト管理者'
      )
    })

    it('deckAdminの場合、「デッキ管理者」を返すこと', () => {
      expect(changeSystemRoleToDisplayName('deckAdmin')).toBe('デッキ管理者')
    })

    it('readerUserの場合、「閲覧者」を返すこと', () => {
      expect(changeSystemRoleToDisplayName('readerUser')).toBe('閲覧者')
    })

    it('不正な値の場合、例外を投げること', () => {
      // @ts-ignore
      expect(() => changeSystemRoleToDisplayName('xxxxxxxxxxx')).toThrowError(
        /は不正な値です/
      )
    })
  })

  describe('changeSystemRolesToDisplay', () => {
    it(`['userAdmin']の場合、「ユーザー管理者」を返すこと`, () => {
      expect(changeSystemRolesToDisplayName(['userAdmin'])).toBe(
        'ユーザー管理者'
      )
    })

    it(`['userAdmin', 'readerUser']の場合、「ユーザー管理者,閲覧者」を返すこと`, () => {
      expect(changeSystemRolesToDisplayName(['userAdmin', 'readerUser'])).toBe(
        'ユーザー管理者,閲覧者'
      )
    })

    it(`['userAdmin', 'readerUser']の場合、「ユーザー管理者,閲覧者」を返すこと`, () => {
      expect(changeSystemRolesToDisplayName(['userAdmin', 'readerUser'])).toBe(
        'ユーザー管理者,閲覧者'
      )
    })

    it(`空配列の場合、空文字を返すこと`, () => {
      expect(changeSystemRolesToDisplayName([])).toBe('')
    })
  })

  describe('fullName', () => {
    it('firstName: 田中, lastName: 太郎 の場合、「田中 太郎」を返すこと', () => {
      expect(fullName('田中', '太郎')).toBe('田中 太郎')
    })

    it('firstName: 田中, lastName: undefined の場合、「田中」を返すこと', () => {
      expect(fullName('田中', undefined)).toBe('田中')
    })

    it('firstName: undefined, lastName: 太郎 の場合、「太郎」を返すこと', () => {
      expect(fullName(undefined, '太郎')).toBe('太郎')
    })

    it('firstName: undefined, lastName: undefined の場合、空文字を返すこと', () => {
      expect(fullName(undefined, undefined)).toBe('')
    })
  })
}
