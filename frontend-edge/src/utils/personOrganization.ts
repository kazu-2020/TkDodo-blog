import { Role } from '@/types/role'

export const personOrganizationRoleName = (role: Role) => {
  const roleTypes: { [key: string]: string } = {
    author: '著者',
    copyrightHolder: '著作権者',
    creator: '作家',
    producer: '制作統括者',
    publisher: '出版者',
    funder: '提供者',
    sponsor: 'スポンサー',
    translator: '翻訳者',
    character: 'キャラクター',
    editor: '編集者',
    director: '監督',
    musicBy: 'サウンドトラックの作曲者',
    actor: '出演'
  }

  const roleType = role.person?.roleName || role.organization?.roleName || ''
  return roleTypes[roleType] || roleType
}

export const personOrganizationName = (role: Role) =>
  role.person?.name || role.organization?.name || ''

export const personOrganizationImageUrl = (role: Role) =>
  role.person?.image?.small?.url || role.organization?.image?.small?.url || ''

export const personOrganizationOccupationName = (role: Role) =>
  role.person?.occupationName || ''

if (import.meta.vitest) {
  const { rolePersonGenerator, roleOrganizationGenerator } = await import(
    '@/test/data-generators'
  )

  const { describe, it, expect } = import.meta.vitest
  describe('personOrganizationRoleName', () => {
    it('個人のロール名が存在するとき', () => {
      const person = rolePersonGenerator({ roleName: 'author' })
      expect(personOrganizationRoleName({ person })).toEqual('著者')
    })

    it('組織のロール名が存在するとき', () => {
      const organization = roleOrganizationGenerator({
        roleName: 'copyrightHolder'
      })
      expect(personOrganizationRoleName({ organization })).toEqual('著作権者')
    })

    it('個人・組織のロール名が存在するとき', () => {
      const person = rolePersonGenerator({ roleName: 'author' })
      const organization = roleOrganizationGenerator({
        roleName: 'copyrightHolder'
      })
      expect(personOrganizationRoleName({ person, organization })).toEqual(
        '著者'
      )
    })

    it('存在しないロール名のとき', () => {
      const person = rolePersonGenerator({ roleName: 'undefined_role_name' })
      expect(personOrganizationRoleName({ person })).toEqual(
        'undefined_role_name'
      )
    })

    it('ロール名が空のとき', () => {
      const person = rolePersonGenerator({ roleName: '' })
      expect(personOrganizationRoleName({ person })).toEqual('')
    })
  })

  describe('personOrganizationName', () => {
    it('個人の名前が存在するとき', () => {
      const person = rolePersonGenerator({ name: 'test person name' })
      expect(personOrganizationName({ person })).toEqual('test person name')
    })

    it('組織の名前が存在するとき', () => {
      const organization = roleOrganizationGenerator({
        name: 'test organization name'
      })
      expect(personOrganizationName({ organization })).toEqual(
        'test organization name'
      )
    })

    it('個人・組織の名前が存在するとき', () => {
      const person = rolePersonGenerator({ name: 'test person name' })
      const organization = roleOrganizationGenerator({
        name: 'test organization name'
      })
      expect(personOrganizationName({ person, organization })).toEqual(
        'test person name'
      )
    })

    it('名前が空のとき', () => {
      const person = rolePersonGenerator({ name: '' })
      expect(personOrganizationName({ person })).toEqual('')
    })

    it('名前が未定義のとき', () => {
      const person = rolePersonGenerator({ name: undefined })
      expect(personOrganizationName({ person })).toEqual('')
    })

    it('ロールが未定義のとき', () => {
      expect(personOrganizationName({ person: undefined })).toEqual('')
    })
  })

  describe('personOrganizationImageUrl', () => {
    const imageRole1 = {
      main: { url: 'main1.jpg', width: 1, height: 1 },
      medium: { url: 'medium1.jpg', width: 1, height: 1 },
      small: { url: 'small1.jpg', width: 1, height: 1 }
    }

    const imageRole2 = {
      main: { url: 'main2.jpg', width: 1, height: 1 },
      medium: { url: 'medium2.jpg', width: 1, height: 1 },
      small: { url: 'small2.jpg', width: 1, height: 1 }
    }

    it('個人の画像が存在するとき', () => {
      const person = rolePersonGenerator({ image: imageRole1 })
      expect(personOrganizationImageUrl({ person })).toEqual('small1.jpg')
    })

    it('組織の画像が存在するとき', () => {
      const organization = roleOrganizationGenerator({ image: imageRole2 })
      expect(personOrganizationImageUrl({ organization })).toEqual('small2.jpg')
    })

    it('個人・組織の画像が存在するとき', () => {
      const person = rolePersonGenerator({ image: imageRole1 })
      const organization = roleOrganizationGenerator({
        image: imageRole2
      })
      expect(personOrganizationImageUrl({ person, organization })).toEqual(
        'small1.jpg'
      )
    })

    it('画像が未定義のとき', () => {
      const person = rolePersonGenerator({ image: undefined })
      expect(personOrganizationImageUrl({ person })).toEqual('')
    })

    it('ロールが未定義のとき', () => {
      expect(personOrganizationImageUrl({ person: undefined })).toEqual('')
    })
  })

  describe('personOrganizationOccupationName', () => {
    it('未定義のとき', () => {
      const person = rolePersonGenerator({ occupationName: undefined })
      expect(personOrganizationOccupationName({ person })).toEqual('')
    })

    it('定義されているとき', () => {
      const person = rolePersonGenerator({ occupationName: 'dummy occupation' })
      expect(personOrganizationOccupationName({ person })).toEqual(
        'dummy occupation'
      )
    })
  })
}
