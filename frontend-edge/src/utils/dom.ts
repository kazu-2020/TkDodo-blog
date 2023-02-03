export const autoLink = (statement: string): string => {
  const regexUrl = /(https?:\/\/[\w.\-_@:/~?%&;=+#',()*!]+)/g

  return statement.replace(
    regexUrl,
    (match) => `<a href="${match}">${match}</a>`
  )
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('autoLink', () => {
    it('文字列の全てのURL部分をaタグに変換すること', () => {
      expect(
        autoLink(
          '続きはhttp://www.example.com/で!続きはhttp://www.example.comで!'
        )
      ).toEqual(
        '続きは<a href="http://www.example.com/">http://www.example.com/</a>で!続きは<a href="http://www.example.com">http://www.example.com</a>で!'
      )

      expect(autoLink('http://www.example.com/xxx/yyy')).toEqual(
        '<a href="http://www.example.com/xxx/yyy">http://www.example.com/xxx/yyy</a>'
      )

      expect(autoLink('http://www.example.com?param=val')).toEqual(
        '<a href="http://www.example.com?param=val">http://www.example.com?param=val</a>'
      )
    })
  })
}
