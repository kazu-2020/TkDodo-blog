declare module '@editorjs/header' {
  import Header from '@editorjs/header'

  export = Header
}

declare module '@editorjs/image' {
  import ImageTool from '@editorjs/image'

  export = ImageTool
}

declare module '@editorjs/embed' {
  import Embed from '@editorjs/embed'

  export = Embed
}

declare module '@editorjs/list' {
  import List from '@editorjs/list'

  export = List
}

declare module '@editorjs/link' {
  import LinkTool from '@editorjs/link'

  export = LinkTool
}
declare module '@editorjs/table' {
  import Table from '@editorjs/table'

  export = Table
}

// original plugins
declare module '@/lib/editorjs/extend_image_tool' {
  import ExtendImageTool from '@/lib/editorjs/extend_image_tool'

  export = ExtendImageTool
}

declare module '@/lib/editorjs/description_link_tool' {
  import DescriptionLinkTool from '@/lib/editorjs/description_link_tool'

  export = DescriptionLinkTool
}

declare module '@/lib/editorjs/default_unordered_list' {
  import DefaultUnorderedList from '@/lib/editorjs/default_unordered_list'

  export = DefaultUnorderedList
}
