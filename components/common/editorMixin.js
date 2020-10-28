import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import ImageTool from '@editorjs/image'
import List from '@editorjs/list'
import Embed from '@editorjs/embed'
import Undo from 'editorjs-undo'

// Original Plugins
import MultiTypeEpisode from '~/plugins/editorjs/multi_type_episode/index.js'
import DescriptionLinkTool from '~/plugins/editorjs/description_link_tool'

import { i18n } from '~/plugins/editorjs/i18n.js'

class DefaultUnorderedList extends List {
  constructor(params) {
    params.data.style = 'unordered'
    super(params)
  }
}

const editorMixin = {
  mounted() {
    this.doEditor()
  },
  methods: {
    doEditor() {
      const _postImageByFile = this.postImageByFile
      const _postImageByUrl = this.postImageByUrl

      this.editor = new EditorJS({
        holder: this.editorId,
        logLevel: 'WARN',
        minHeight: 0,
        tools: {
          paragraph: {
            inlineToolbar: ['bold', 'italic'],
          },
          header: {
            class: Header,
            config: {
              placeholder: '見出しを入力してください',
              levels: [2],
              defaultLevel: 2,
            },
            inlineToolbar: ['bold', 'italic'],
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile(file) {
                  return _postImageByFile(file)
                },
                uploadByUrl(url) {
                  return _postImageByUrl(url)
                },
              },
            },
          },
          list: {
            class: DefaultUnorderedList,
            inlineToolbar: ['bold', 'italic'],
          },
          linkTool: {
            class: DescriptionLinkTool,
            config: {
              endpoint: process.env.apiBaseUrl + '/editor/fetch_link',
            },
          },
          embed: {
            class: Embed,
            config: {
              services: {
                dokos: {
                  regex: /https?:\/\/movie-a.nhk.or.jp\/(movie.*)\/\?.*v=([^/?&]*).*/,
                  embedUrl:
                    'https://movie-a.nhk.or.jp/<%= remote_id %>&type=video',
                  html:
                    '<iframe frameborder="0" scrolling="no" align="middle" height="360" width="640" allowtransparency="true" allowfullscreen></iframe>',
                  height: 360,
                  width: 640,
                  id: (ids) => ids.join('/?v='), // movie_stg/?v=<%= remote_id %>
                },
              },
            },
          },
          multiTypeEpisode: {
            class: MultiTypeEpisode,
            inlineToolbar: false,
            config: {
              endpoint: process.env.apiBaseUrl,
              playlistId: this.playlistId,
            },
          },
        },
        data: this.editorData,
        i18n,
        onChange: () => {
          this.updateEditorData()
        },
        onReady: () => {
          new Undo({ editor: this.editor }) // eslint-disable-line no-new
          this.initializeEditor()
        },
      })
    },
    postImageByFile(file) {
      return this.FileReaderAsync(file)
        .then((e) => this.loadImageAsync(e.target.result))
        .then((img) => {
          let err = false
          if (!this.validateFileWidth(img)) {
            this.notifyError('画像ファイルの幅を5000px以下にしてください')
            err = true
          }
          if (!this.validateFileHeight(img)) {
            this.notifyError('画像ファイルの高さを5000px以下にしてください')
            err = true
          }
          if (!this.validateFileSize(file)) {
            this.notifyError('画像ファイルのサイズを10MB以下にしてください')
            err = true
          }
          if (err) {
            this.destroyCurrentBlock()
            return {
              success: 1,
              file: {
                url: null,
              },
            }
          }
          return this.postImage(this.imageByFileEndpoint, file)
        })
    },
    loadImageAsync(src) {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.src = src
      })
    },
    FileReaderAsync(file) {
      return new Promise((resolve) => {
        const fileReader = new FileReader()
        fileReader.onload = (e) => resolve(e)
        fileReader.readAsDataURL(file)
      })
    },
    validateFileSize(file) {
      const limitSize = 10 * Math.pow(1024, 2) // 10MB
      return file.size < limitSize
    },
    validateFileWidth(img) {
      const limitWidth = 5000
      return img.width < limitWidth
    },
    validateFileHeight(img) {
      const limitHeight = 5000
      return img.height < limitHeight
    },
    notifyError(message) {
      this.editor.notifier.show({
        message,
        style: 'error',
      })
    },
    destroyCurrentBlock() {
      const i = this.editor.blocks.getCurrentBlockIndex()
      this.editor.blocks.delete(i)
    },
    postImageByUrl(url) {
      return this.$axios
        .post(this.imageByUrlEndpoint, { url })
        .then((res) => {
          return {
            success: 1,
            file: {
              url: res.data.file.url,
            },
          }
        })
        .catch((err) => {
          err.response.data.messages.forEach((msg) => this.notifyError(msg))
          this.destroyCurrentBlock()
          return {
            success: 1,
            file: {
              url: null,
            },
          }
        })
    },
    postImage(endpoint, file) {
      const formData = new FormData()
      formData.append('image', file)
      return this.$axios
        .post(endpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          return {
            success: 1,
            file: {
              url: res.data.file.url,
            },
          }
        })
    },
  },
}

export default editorMixin
